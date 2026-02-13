import React from "react";

export default function Help() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Help - Ocean View Resort Galle</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">For New Staff Members - Reservation System Guidelines</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Customer Flow:</strong> Customers must first check room availability on the home page. Only if rooms are available can they register and log in to make a reservation.</li>
          <li><strong>Add Reservation:</strong> Guest name, address, contact number, room type, check-in (today only), check-out (future), and times in AM/PM format are required. The system auto-generates a reservation number and calculates the bill.</li>
          <li><strong>View/Update/Delete:</strong> Logged-in customers can view, update, or delete their own reservations from the View Reservation page. They can also download their bill as PDF.</li>
          <li><strong>Admin Access:</strong> Log in with username <code className="bg-gray-100 px-1">admin</code> and password <code className="bg-gray-100 px-1">admin123</code>. Admins can create managers and receptionists, manage all admins, and perform all operations.</li>
          <li><strong>Manager:</strong> Can add/update/delete rooms, create and cancel reservations, view customers. Cannot create or delete admins.</li>
          <li><strong>Receptionist:</strong> Can create walk-in reservations, view reservations and rooms, check availability. Cannot add/delete rooms or view customer list.</li>
          <li><strong>Exit:</strong> Users can safely close the application or log out at any time.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p className="text-gray-700">For technical support or further assistance, contact the IT department.</p>
      </section>
    </div>
  );
}
