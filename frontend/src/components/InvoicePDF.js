import jsPDF from "jspdf";

export const generateInvoice = (data) => {
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Ocean View Resort – Galle", 20, 20);

  pdf.setFontSize(12);
  pdf.text(`Reservation No: ${data.reservationId}`, 20, 40);
  pdf.text(`Guest Name: ${data.name}`, 20, 50);
  pdf.text(`Room Type: ${data.roomType}`, 20, 60);
  pdf.text(`Check-in: ${data.checkIn}`, 20, 70);
  pdf.text(`Check-out: ${data.checkOut}`, 20, 80);
  pdf.text(`Total Bill: LKR ${data.bill}`, 20, 100);

  pdf.text("Thank you for choosing Ocean View Resort!", 20, 120);

  pdf.save("invoice.pdf");
};

export default generateInvoice;