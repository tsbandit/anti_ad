(() => {


console.log('booking.js running');

document.querySelectorAll('[data-hotel-rounded-price]:has([data-testid="cancellation-subtitle"])')

const booking_script = () => {
  console.log('booking_script running');

  const {score, review_count} = (() => {
    const text = document.querySelector('[data-testid="review-score-right-component"]').innerText;
    const score = parseFloat(text.match(/Scored ([\d\.]+)/i)[1]);
    const review_count = parseInt(text.match(/([\d,]+) reviews/i)[1].replaceAll(',', ''));
    return {score, review_count};
  })();

  // Select all elements that contain cancellation policy text
  const policyElements = document.querySelectorAll('[data-hotel-rounded-price]');

  console.log('booking: num candidates: ', [...policyElements].length);

  const results = [];

  policyElements.forEach((element, index) => {
      const cancellation_policy_element = element.querySelector('[data-testid="cancellation-subtitle"]');

      const text = cancellation_policy_element.textContent.trim();

"Fully refundable (by Booking.com) before April 12, 2026"

      // Look for common patterns indicating free cancellation deadlines
      const deadlineMatch = (
            text.match(/Fully refundable .*before ()(.+)/i)
        ||  text.match(/Free cancellation before (.+) on (.+)/i)
//        ||  text.match(/cancel free until (.+)/i)
//        ||  text.match(/free cancellation (up to .+ before)/i)
//        ||  text.match(/Non-refundable/i)
      );

// 'Scored 7.4\n7.4\nRated good\nGood\n1,781 reviews'
 //

//      if (deadlineMatch) {
          results.push({
              elementIndex: index,
              fullText: text,
              url: window.location.href,
              match: ((deadlineMatch) ? [deadlineMatch[1], deadlineMatch[2]] : null),
              score,
              review_count,
          });
//      }
  });

  console.log('Booking.com Cancellation Deadlines Found:', results);
};

const site = (s) => (window.location.hostname.endsWith(s));

if(site('booking.com')) {
  console.log('site detected as booking.com');
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', booking_script);
  } else {
    booking_script();
  }
}


})();
