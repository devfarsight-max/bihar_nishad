import './Donate.css';

const bankDetails = [
  ['Account Holder', 'SJPB HATHUA SUGAR & BIO REFINERY PRIVATE LIMITED'],
  ['Bank Name', 'Central Bank of India'],
  ['Account Number', '3847113679'],
  ['Account Type', 'Current Account'],
  ['IFSC Code', 'CBIN0280011'],
  ['Branch', 'Rajendra Nagar'],
  ['City', 'Patna'],
  ['State', 'Bihar'],
  ['PIN Code', '800016'],
];

export default function Donate() {
  return (
    <section className="section container donation-bank-details" aria-labelledby="bank-transfer-title">
      <div className="donation-card">
        <h1 id="bank-transfer-title">Bank transfer details</h1>
        <dl>
          {bankDetails.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
