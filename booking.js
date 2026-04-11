(() => {


const booking_script = () => {
  
  // Select all elements that contain cancellation policy text
  const policyElements = document.querySelectorAll('span[data-testid="policy-badge-text"], div[data-testid="cancellation-policy-info"], .cancellation-policy');

  const results = [];

  policyElements.forEach((element, index) => {
      const text = element.textContent.trim();
      
      // Look for common patterns indicating free cancellation deadlines
      const deadlineMatch = text.match(/free cancellation until (.+)/i) || 
                            text.match(/cancel free until (.+)/i) || 
                            text.match(/free cancellation (up to .+ before)/i);

      if (deadlineMatch) {
          results.push({
              elementIndex: index,
              fullText: text,
              deadline: deadlineMatch[1].trim()
          });
      }
  });

  console.log('Booking.com Cancellation Deadlines Found:', results);
};

const site = (s) => (window.location.hostname.endsWith(s));

if(site('booking.com')) {
  document.addEventListener('DOMContentLoaded', booking_script);
}


})();
