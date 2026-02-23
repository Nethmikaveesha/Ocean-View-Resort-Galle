

import jsPDF from "jspdf";

export const generateInvoice = (data) => {
  const pdf = new jsPDF();
  
  // Colors - Coastal luxury theme
  const primaryBlue = [8, 145, 178]; // Cyan-600
  const accentGold = [245, 158, 11]; // Amber-500
  const darkText = [30, 41, 59]; // Slate-800
  const lightGray = [241, 245, 249]; // Slate-100
  const mediumGray = [148, 163, 184]; // Slate-400

  // Header with gradient background effect
  pdf.setFillColor(...primaryBlue);
  pdf.rect(0, 0, 210, 50, "F");
  
  // Decorative accent bar
  pdf.setFillColor(...accentGold);
  pdf.rect(0, 50, 210, 3, "F");

  // Resort Logo/Icon (Ocean Wave emoji approximation using text)
  pdf.setFontSize(28);
  pdf.setTextColor(255, 255, 255);
  pdf.text("🌊", 20, 25);

  // Resort Name
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Ocean View Resort", 40, 28);

  // Subtitle
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(220, 240, 250);
  pdf.text("Galle, Sri Lanka | Luxury by the Ocean", 40, 36);

  // Document Title
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkText);
  pdf.text("RESERVATION INVOICE", 20, 70);

  // Reservation Number Badge
  pdf.setFillColor(...lightGray);
  pdf.roundedRect(135, 61, 55, 12, 3, 3, "F");
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryBlue);
  pdf.text(`#${data.reservationId}`, 140, 69);

  // Guest Information Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryBlue);
  pdf.text("Guest Information", 20, 90);

  // Guest info box
  pdf.setDrawColor(...mediumGray);
  pdf.setLineWidth(0.5);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(20, 95, 170, 25, 2, 2, "FD");

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...darkText);
  pdf.text("Guest Name:", 25, 105);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.name, 60, 105);

  // Booking Details Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryBlue);
  pdf.text("Booking Details", 20, 135);

  // Details box
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(20, 140, 170, 50, 2, 2, "FD");

  // Room Type
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Room Type", 25, 150);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkText);
  pdf.setFontSize(11);
  pdf.text(data.roomType, 25, 157);

  // Check-in
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Check-in", 80, 150);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkText);
  pdf.setFontSize(11);
  pdf.text(data.checkIn, 80, 157);

  // Check-out
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Check-out", 135, 150);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkText);
  pdf.setFontSize(11);
  pdf.text(data.checkOut, 135, 157);

  // Calculate nights (optional display)
  const checkInDate = new Date(data.checkIn);
  const checkOutDate = new Date(data.checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Duration", 25, 170);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...darkText);
  pdf.setFontSize(11);
  pdf.text(`${nights} Night${nights !== 1 ? 's' : ''}`, 25, 177);

  // Payment Summary Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryBlue);
  pdf.text("Payment Summary", 20, 205);

  // Total bill box with gradient effect
  pdf.setFillColor(...primaryBlue);
  pdf.roundedRect(20, 210, 170, 25, 3, 3, "F");

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(220, 240, 250);
  pdf.text("Total Amount", 25, 220);

  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text(`LKR ${data.bill.toLocaleString()}`, 25, 230);

  // Footer section
  pdf.setDrawColor(...accentGold);
  pdf.setLineWidth(1);
  pdf.line(20, 250, 190, 250);

  // Thank you message
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(...darkText);
  pdf.text("Thank you for choosing Ocean View Resort!", 20, 260);

  // Contact information
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mediumGray);
  pdf.text("Ocean View Resort, Galle, Sri Lanka", 20, 270);
  pdf.text("Phone: +94 3734277 | Email: info@oceanviewresort.lk", 20, 276);

  // Decorative wave at bottom
  pdf.setFontSize(8);
  pdf.setTextColor(...primaryBlue);
  pdf.text("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~", 20, 285);

  // Save with descriptive filename
  pdf.save(`Ocean-View-Resort-Invoice-${data.reservationId}.pdf`);
};

export default generateInvoice;