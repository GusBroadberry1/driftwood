const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { duration } = req.body;
    const days = Number(duration) || 7;

    let amount = 599;
    if (days <= 4) amount = 399;
    else if (days <= 14) amount = 599;
    else if (days <= 30) amount = 699;
    else amount = 899;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Driftwood Full Itinerary",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/?paid=true`,
      cancel_url: `${req.headers.origin}/?paid=false`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
