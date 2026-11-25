import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactDetails() {
  return (
    <section aria-labelledby="contact-details-heading">
      <h2 id="contact-details-heading">Contact details</h2>
      <div className="contact-item">
        <Mail size={22} aria-hidden="true" />
        <div>
          <h3>Email</h3>
          <a className="underline break-all" href="mailto:lbprasad82@gmail.com">
            lbprasad82@gmail.com
          </a>
        </div>
      </div>
      <div className="contact-item">
        <Phone size={22} aria-hidden="true" />
        <div>
          <h3>Phone</h3>
          <a className="underline" href="tel:+919934406145">9934406145</a>
        </div>
      </div>
      <div className="contact-item">
        <MapPin size={22} aria-hidden="true" />
        <div>
          <h3>Address</h3>
          <p>
            SJPB HATHUA SUGAR &amp; BIO REFINERY PRIVATE LIMITED, Regional
            Office, Chatterjee International, Kolkata, West Bengal &ndash;
            700071, India.
          </p>
        </div>
      </div>
    </section>
  );
}
