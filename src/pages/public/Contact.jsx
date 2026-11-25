import ContactDetails from "../../components/ContactDetails";
import { PageHeader } from "../../components/UI";

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="SAY HELLO" title="Contact us" />
      <div className="section container">
        <ContactDetails />
      </div>
    </>
  );
}
