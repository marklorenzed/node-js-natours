/*eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_o1z32tbIzEJHdOXlFZsDAgih00vGpBHdQz');
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    // 1)get session from the server
    const session = await axios(
      `http://localhost:3002/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charge credit card for us
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(error);
    showAlert('error', err);
  }
};
