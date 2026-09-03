import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import { calculateShipping, calculateTax } from '@/lib/utils';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress } = await req.json();

    // 1. Fetch user's cart from Supabase
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product:products(*, images:product_images(*)), variant:product_variants(*)')
      .eq('user_id', session.user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 2. Calculate totals on the server securely
    let subtotal = 0;
    cartItems.forEach(item => {
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
      subtotal += price * item.quantity;
    });

    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;
    const totalInPaise = Math.round(total * 100);

    // 3. Generate a unique order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${randomBytes(2).toString('hex').toUpperCase()}`;

    // 4. Initialize Razorpay
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // For MVP if Razorpay keys are missing, we mock the Razorpay order creation
      console.warn("Razorpay keys missing, simulating order creation for dev");
    }

    let razorpayOrder;
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
      });

      razorpayOrder = await razorpay.orders.create({
        amount: totalInPaise,
        currency: 'INR',
        receipt: orderNumber,
      });
    } catch (rzpErr: any) {
      console.error('Razorpay Error:', rzpErr);
      // Fallback for local development if keys are bad
      razorpayOrder = {
        id: `order_sim_${randomBytes(4).toString('hex')}`,
        amount: totalInPaise,
        currency: 'INR',
      };
    }

    // 5. Create Order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        order_number: orderNumber,
        status: 'payment_pending',
        subtotal,
        shipping_amount: shipping,
        tax_amount: tax,
        total,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order in database: ${orderError?.message}`);
    }

    // 6. Create Order Items
    const orderItemsData = cartItems.map(item => {
      const primaryImage = item.product.images?.find((img: any) => img.is_primary) || item.product.images?.[0];
      const price = item.variant ? Number(item.variant.price) : Number(item.product.price);
      
      return {
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        product_name: item.product.name,
        variant_name: item.variant?.name || null,
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
        image_url: primaryImage?.url || null, // SAVING IMAGE URL
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      throw new Error('Failed to create order items');
    }

    // 7. Create Payment Record
    await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        amount: total,
        currency: 'INR',
        status: 'pending',
      });

    return NextResponse.json({
      razorpayOrder,
      orderId: order.id,
      orderNumber,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
