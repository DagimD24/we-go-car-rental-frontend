import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <a className="text-primary hover:text-primary-700 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </a>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="lead">
              Welcome to CarRental. By using our service, you agree to comply with and be bound by the following 
              terms and conditions. Please review these terms carefully.
            </p>
            
            <h2>1. Rental Agreement</h2>
            <p>
              By booking a vehicle through our service, you enter into a rental agreement with CarRental. 
              This agreement is governed by the laws of the state in which the rental begins and is subject 
              to the terms and conditions outlined herein.
            </p>
            
            <h2>2. Eligibility Requirements</h2>
            <p>
              To rent a vehicle, you must:
            </p>
            <ul>
              <li>Be at least 21 years of age (25 for luxury and specialty vehicles)</li>
              <li>Possess a valid driver's license that has been held for at least one year</li>
              <li>Present a valid credit card in your name at the time of pickup</li>
              <li>Meet our insurance and credit requirements</li>
            </ul>
            
            <h2>3. Reservation and Payment</h2>
            <p>
              Your reservation is confirmed upon receipt of payment. The rental rate includes the base 
              rental fee for the selected vehicle, basic insurance coverage, and standard equipment. 
              Additional services, extended insurance coverage, and accessories are subject to extra charges.
            </p>
            
            <h2>4. Cancellation Policy</h2>
            <p>
              Free cancellation is available up to 24 hours before the scheduled pickup time. Cancellations 
              made within 24 hours of the pickup time may incur a fee equal to one day's rental charge. 
              No-shows will be charged the full rental amount.
            </p>
            
            <h2>5. Vehicle Pickup and Return</h2>
            <p>
              You agree to pick up and return the vehicle at the designated location on the specified dates. 
              Late returns will incur additional daily charges. The vehicle must be returned in the same 
              condition as received, with a full fuel tank unless a prepaid fuel option was selected.
            </p>
            
            <h2>6. Vehicle Use</h2>
            <p>
              The rental vehicle may only be:
            </p>
            <ul>
              <li>Driven by the renter or additional authorized drivers listed on the rental agreement</li>
              <li>Used on properly maintained roads and in accordance with traffic laws</li>
              <li>Used within the designated geographic area specified in the rental agreement</li>
            </ul>
            <p>
              Prohibited uses include but are not limited to off-road driving, racing, towing, or 
              transporting hazardous materials.
            </p>
            
            <h2>7. Insurance and Liability</h2>
            <p>
              Basic insurance coverage is included in your rental. You may purchase additional coverage 
              options. You are responsible for any damage to the vehicle not covered by the selected 
              insurance plan, including deductibles or exclusions.
            </p>
            
            <h2>8. Privacy Policy</h2>
            <p>
              We collect and process your personal information in accordance with our Privacy Policy. 
              By accepting these terms, you acknowledge that you have read and understood our privacy practices.
            </p>
            
            <h2>9. Fuel Policy</h2>
            <p>
              Vehicles are provided with a full tank of fuel and should be returned with a full tank. 
              If the vehicle is returned with less fuel than at pickup, you will be charged for the 
              missing fuel plus a refueling service fee.
            </p>
            
            <h2>10. Vehicle Condition and Inspections</h2>
            <p>
              You are responsible for inspecting the vehicle at pickup and reporting any existing damage. 
              You will be held responsible for any unreported damage discovered upon return.
            </p>
            
            <h2>11. Traffic Violations and Tolls</h2>
            <p>
              You are responsible for all traffic violations, tolls, and parking fees incurred during your 
              rental period. Any fines or fees received by us will be charged to you plus an administrative fee.
            </p>
            
            <h2>12. Breakdowns and Accidents</h2>
            <p>
              In case of a breakdown or accident, contact our emergency assistance number immediately. 
              Do not authorize repairs without our approval. In case of an accident, also contact local 
              police and obtain a police report.
            </p>
            
            <h2>13. Limitation of Liability</h2>
            <p>
              CarRental is not liable for indirect, incidental, special, or consequential damages, including 
              loss of profits, revenue, data, or use, arising from or relating to the rental.
            </p>
            
            <h2>14. Modifications and Disputes</h2>
            <p>
              We reserve the right to modify these terms at any time. Any disputes arising from the rental 
              agreement shall be resolved through arbitration in accordance with the laws of the state in 
              which the rental begins.
            </p>
            
            <h2>15. Severability</h2>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions 
              will remain in full force and effect.
            </p>
            
            <h2>16. Entire Agreement</h2>
            <p>
              These terms constitute the entire agreement between you and CarRental regarding the rental service 
              and supersede all prior agreements and understandings.
            </p>
            
            <p className="mt-8">
              <strong>Last updated:</strong> May 1, 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
