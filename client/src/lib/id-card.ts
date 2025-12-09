import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { Scout } from "@shared/schema";

export interface IDCardData {
  scout: Scout;
  schoolName?: string;
  unitName?: string;
  profilePhotoUrl?: string;
}

/**
 * Generate a Scout ID Card PDF
 * ID card is credit card sized: 85.6mm x 53.98mm (3.375" x 2.125")
 * Photo size: 1x1 inch (25.4mm x 25.4mm)
 */
export async function generateScoutIDCard(data: IDCardData): Promise<void> {
  const { scout, schoolName, unitName, profilePhotoUrl } = data;
  
  // Create PDF with ID card dimensions (85.6mm x 53.98mm)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [85.6, 53.98],
  });

  // Set background color
  pdf.setFillColor(240, 248, 255); // Light blue background
  pdf.rect(0, 0, 85.6, 53.98, "F");

  // Header bar
  pdf.setFillColor(25, 118, 210); // Blue header
  pdf.rect(0, 0, 85.6, 8, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("BOY SCOUTS OF THE PHILIPPINES", 42.8, 5, { align: "center" });

  // Scout Photo (left side) - 1x1 inch (25.4mm x 25.4mm)
  const photoX = 3;
  const photoY = 11;
  const photoSize = 20; // 20mm x 20mm (slightly smaller than 1x1 inch for better fit)
  
  if (profilePhotoUrl) {
    try {
      pdf.addImage(profilePhotoUrl, "JPEG", photoX, photoY, photoSize, photoSize);
    } catch (error) {
      console.error("Error adding profile photo:", error);
      // Fallback to placeholder
      pdf.setFillColor(200, 200, 200);
      pdf.rect(photoX, photoY, photoSize, photoSize, "F");
    }
  } else {
    // Photo placeholder
    pdf.setFillColor(200, 200, 200);
    pdf.rect(photoX, photoY, photoSize, photoSize, "F");
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(6);
    pdf.text("2x2", photoX + photoSize/2, photoY + photoSize/2, { align: "center" });
    pdf.text("PHOTO", photoX + photoSize/2, photoY + photoSize/2 + 3, { align: "center" });
  }

  // Scout Information (right side)
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  const nameText = scout.name.length > 20 ? scout.name.substring(0, 17) + "..." : scout.name;
  pdf.text(nameText.toUpperCase(), 26, 14);

  pdf.setFontSize(6);
  pdf.setFont("helvetica", "normal");
  
  let yPos = 18;
  const lineHeight = 3.5;

  // ID Number
  pdf.setFont("helvetica", "bold");
  pdf.text("ID:", 26, yPos);
  pdf.setFont("helvetica", "normal");
  pdf.text(scout.uid, 32, yPos);
  yPos += lineHeight;

  // Gender & Blood Type
  pdf.setFont("helvetica", "bold");
  pdf.text("Gender:", 26, yPos);
  pdf.setFont("helvetica", "normal");
  pdf.text(scout.gender || "N/A", 36, yPos);
  
  if (scout.bloodType) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Blood:", 50, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(scout.bloodType, 59, yPos);
  }
  yPos += lineHeight;

  // Rank
  if (scout.rank) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Rank:", 26, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(scout.rank, 34, yPos);
    yPos += lineHeight;
  }

  // School
  if (schoolName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("School:", 26, yPos);
    pdf.setFont("helvetica", "normal");
    const schoolText = schoolName.length > 20 ? schoolName.substring(0, 17) + "..." : schoolName;
    pdf.text(schoolText, 37, yPos);
    yPos += lineHeight;
  }

  // Unit
  if (unitName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Unit:", 26, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(unitName, 34, yPos);
  }

  // QR Code (bottom right corner) - Smaller size to avoid overlap
  try {
    const qrDataUrl = await QRCode.toDataURL(scout.uid, {
      width: 50,
      margin: 0,
      errorCorrectionLevel: "M",
    });
    // Positioned at bottom right, smaller (14mm x 14mm)
    pdf.addImage(qrDataUrl, "PNG", 68, 35, 14, 14);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Emergency Contact (bottom left)
  if (scout.emergencyContact) {
    pdf.setFontSize(5);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Emergency: ${scout.emergencyContact}`, 3, 35);
  }

  // Footer
  pdf.setFontSize(5);
  pdf.setTextColor(100, 100, 100);
  pdf.text("This card is valid and must be presented when required", 3, 51);

  // Border
  pdf.setDrawColor(25, 118, 210);
  pdf.setLineWidth(0.5);
  pdf.rect(0.5, 0.5, 84.6, 52.98);

  // Download the PDF
  const filename = `scout_id_${scout.uid}_${scout.name.replace(/\s+/g, "_")}.pdf`;
  pdf.save(filename);
}

/**
 * Generate multiple ID cards (2 per page for printing)
 */
export async function generateBulkIDCards(scouts: IDCardData[]): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let isFirstCard = true;

  for (let i = 0; i < scouts.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    // Position two ID cards per page (centered)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    const pageWidth = 210; // A4 width
    const marginX = (pageWidth - cardWidth) / 2;

    // First card (top)
    await addIDCardToPage(pdf, scouts[i], marginX, 30);

    // Second card (bottom) if available
    if (i + 1 < scouts.length) {
      await addIDCardToPage(pdf, scouts[i + 1], marginX, 120);
      i++; // Skip next iteration since we processed it
    }
  }

  pdf.save(`bulk_scout_ids_${new Date().getTime()}.pdf`);
}

/**
 * Helper function to add an ID card to an existing PDF page
 */
async function addIDCardToPage(
  pdf: jsPDF,
  data: IDCardData,
  x: number,
  y: number
): Promise<void> {
  const { scout, schoolName, unitName } = data;

  // Background
  pdf.setFillColor(240, 248, 255);
  pdf.rect(x, y, 85.6, 53.98, "F");

  // Header
  pdf.setFillColor(25, 118, 210);
  pdf.rect(x, y, 85.6, 10, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("BOY SCOUTS OF THE PHILIPPINES", x + 42.8, y + 6, { align: "center" });

  // Photo placeholder
  pdf.setFillColor(200, 200, 200);
  pdf.rect(x + 5, y + 13, 22, 28, "F");
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(6);
  pdf.text("PHOTO", x + 16, y + 27.5, { align: "center" });

  // Scout Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(scout.name.toUpperCase(), x + 30, y + 16);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  
  let yPos = y + 21;
  const lineHeight = 4;

  pdf.setFont("helvetica", "bold");
  pdf.text("ID:", x + 30, yPos);
  pdf.setFont("helvetica", "normal");
  pdf.text(scout.uid, x + 38, yPos);
  yPos += lineHeight;

  pdf.setFont("helvetica", "bold");
  pdf.text("Gender:", x + 30, yPos);
  pdf.setFont("helvetica", "normal");
  pdf.text(scout.gender || "N/A", x + 42, yPos);
  yPos += lineHeight;

  if (scout.rank) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Rank:", x + 30, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(scout.rank, x + 40, yPos);
    yPos += lineHeight;
  }

  if (schoolName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("School:", x + 30, yPos);
    pdf.setFont("helvetica", "normal");
    const schoolText = schoolName.length > 25 ? schoolName.substring(0, 22) + "..." : schoolName;
    pdf.text(schoolText, x + 42, yPos);
    yPos += lineHeight;
  }

  if (unitName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Unit:", x + 30, yPos);
    pdf.setFont("helvetica", "normal");
    pdf.text(unitName, x + 38, yPos);
  }

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(scout.uid, {
      width: 60,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    pdf.addImage(qrDataUrl, "PNG", x + 62, y + 32, 18, 18);
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Footer
  pdf.setFontSize(5);
  pdf.setTextColor(100, 100, 100);
  pdf.text("This card is valid and must be presented when required", x + 42.8, y + 50, { align: "center" });

  // Border
  pdf.setDrawColor(25, 118, 210);
  pdf.setLineWidth(0.5);
  pdf.rect(x + 0.5, y + 0.5, 84.6, 52.98);
}

