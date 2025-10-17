import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { QueueVisit } from '@hms/api-client';

export interface PrescriptionGenerationPayload {
  patient: QueueVisit | null;
  doctor?: {
    name: string;
    speciality?: string;
    department?: string;
    registrationNumber?: string;
    id?: number;
  };
  hospital?: {
    name: string;
    address?: string;
    phone?: string;
  };
  medicalHistory: string[];
  symptoms: string[];
  diagnosis: string[];
  medications: Array<{
    name: string;
    form?: string;
    composition?: string;
    dose?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  investigations: string[];
  vitals: string[];
}

const addSection = (doc: jsPDF, title: string, lines: string[], cursorY: number): number => {
  if (lines.length === 0) {
    return cursorY;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, 40, cursorY);
  cursorY += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 500);
    doc.text(wrapped, 50, cursorY);
    cursorY += wrapped.length * 12;
  });

  return cursorY + 4;
};

export const buildPrescriptionPdf = ({
  patient,
  doctor,
  hospital,
  medicalHistory,
  symptoms,
  diagnosis,
  medications,
  investigations,
  vitals,
}: PrescriptionGenerationPayload): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const marginX = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightX = pageWidth - marginX;

  let leftCursorY = 60;
  let rightCursorY = 60;

  const doctorLines: string[] = [];
  if (doctor?.name) {
    doctorLines.push(doctor.name);
  }
  if (doctor?.speciality) {
    doctorLines.push(doctor.speciality);
  }
  if (doctor?.department) {
    doctorLines.push(`Department: ${doctor.department}`);
  }

  const hospitalLines: string[] = [];
  if (hospital?.name) {
    hospitalLines.push(hospital.name);
  }
  if (hospital?.address) {
    hospitalLines.push(hospital.address);
  }
  if (hospital?.phone) {
    hospitalLines.push(`Phone: ${hospital.phone}`);
  }

  if (doctorLines.length > 0) {
    const [doctorHeading, ...doctorDetails] = doctorLines;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(doctorHeading, marginX, leftCursorY);
    leftCursorY += 18;

    if (doctorDetails.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doctorDetails.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, 260);
        doc.text(wrapped, marginX, leftCursorY);
        leftCursorY += wrapped.length * 14;
      });
    }
  }

  if (hospitalLines.length > 0) {
    const [hospitalHeading, ...hospitalDetails] = hospitalLines;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(hospitalHeading, rightX, rightCursorY, { align: 'right' });
    rightCursorY += 18;

    if (hospitalDetails.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      hospitalDetails.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, 260);
        wrapped.forEach((wrappedLine: string) => {
          doc.text(wrappedLine, rightX, rightCursorY, { align: 'right' });
          rightCursorY += 14;
        });
      });
    }
  }

  const headerBottom = Math.max(leftCursorY, rightCursorY);
  if (doctorLines.length > 0 || hospitalLines.length > 0) {
    doc.setDrawColor(220, 220, 220);
    doc.line(marginX, headerBottom + 6, rightX, headerBottom + 6);
  }

  let cursorY = headerBottom + 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Prescription Summary', marginX, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  cursorY += 20;

  if (patient) {
    const patientLines = [
      `Patient: ${patient.patient_name}`,
      `Age: ${patient.patient_age}${patient.patient_gender ? `, Gender: ${patient.patient_gender}` : ''}`,
      `OP ID: ${patient.op_id}`,
    ];
    patientLines.forEach((line) => {
      doc.text(line, marginX, cursorY);
      cursorY += 14;
    });
  }

  const generatedAt = new Date().toLocaleString();
  doc.text(`Generated: ${generatedAt}`, marginX, cursorY);
  cursorY += 24;

  // Sections
  cursorY = addSection(doc, 'Patient Medical History', medicalHistory, cursorY);
  cursorY = addSection(doc, 'Symptoms', symptoms, cursorY);
  cursorY = addSection(doc, 'Diagnosis', diagnosis, cursorY);

  if (vitals.length > 0) {
    cursorY = addSection(doc, 'Vitals', vitals, cursorY);
  }

  if (investigations.length > 0) {
    cursorY = addSection(doc, 'Investigations', investigations, cursorY);
  }

  // Ensure some spacing before table
  cursorY = Math.max(cursorY, 200);
  cursorY += 10;

  if (medications.length > 0) {
    const tableWidth = pageWidth - marginX * 2;
    const serialWidth = 45;
    const remainingWidth = tableWidth - serialWidth;

    autoTable(doc, {
      startY: cursorY,
      tableWidth,
      head: [['#', 'Medications', 'Dose', 'Frequency', 'Duration', 'Instructions']],
      body: medications.map((med, index) => {
        const lines: string[] = [med.name];
        if (med.form) {
          lines.push(`(${med.form})`);
        }
        if (med.composition) {
          lines.push(med.composition);
        }

        return [
          (index + 1).toString(),
          lines.join('\n'),
          med.dose ?? '',
          med.frequency ?? '',
          med.duration ?? '',
          med.instructions ?? '',
        ];
      }),
      styles: {
        fontSize: 9,
        cellPadding: 6,
      },
      headStyles: {
        fillColor: [65, 105, 225],
        textColor: 255,
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: serialWidth },
        1: { cellWidth: remainingWidth * 0.4 },
        2: { cellWidth: remainingWidth * 0.12 },
        3: { cellWidth: remainingWidth * 0.12 },
        4: { cellWidth: remainingWidth * 0.12 },
        5: { cellWidth: remainingWidth * 0.24 },
      },
      margin: { left: marginX, right: marginX },
    });
  }

  return doc;
};

export const downloadPrescriptionPdf = (payload: PrescriptionGenerationPayload) => {
  const doc = buildPrescriptionPdf(payload);
  doc.save(`prescription-${payload.patient?.op_id ?? 'patient'}.pdf`);
};
