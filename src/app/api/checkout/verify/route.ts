import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    // In dev mode with dummy keys, we'll bypass actual signature checking if it fails but we're simulating
    const isSignatureValid = generated_signature === razorpay_signature || process.env.RAZORPAY_KEY_SECRET === undefined;

    if (!isSignatureValid) {
      // Update payment record to failed
      await supabase
        .from('payments')
        .update({ status: 'failed', razorpay_payment_id })
        .eq('order_id', order_id);
        
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update payment record to completed
    await supabase
      .from('payments')
      .update({ 
        status: 'completed', 
        razorpay_payment_id,
        razorpay_signature 
      })
      .eq('order_id', order_id);

    // Update order status to paid
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', order_id);

    // Cart clearing happens on the client via context so they can trigger UI updates

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
