import { jsPDF } from 'jspdf';
import { MasterProfile, TailoredResumeResult } from '../types';

export function generateAtsResumePdf(profile: MasterProfile, tailored: TailoredResumeResult): jsPDF {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter' // 612 x 792 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header: Full Name
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  const fullName = profile.personalInfo.fullName.toUpperCase();
  doc.text(fullName, pageWidth / 2, y, { align: 'center' });
  y += 18;

  // Contact line
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  const contactParts = [
    profile.personalInfo.location,
    profile.personalInfo.phone,
    profile.personalInfo.email,
    profile.personalInfo.linkedIn,
    profile.personalInfo.github
  ].filter(Boolean);

  const contactLine = contactParts.join(' | ');
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
  y += 16;

  // Section divider helper
  const renderSectionHeader = (title: string) => {
    checkPageBreak(30);
    y += 6;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setLineWidth(0.75);
    doc.setDrawColor(50, 50, 50);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;
  };

  // 1. Professional Summary
  renderSectionHeader('Professional Summary');
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  const summaryText = tailored.tailoredSummary || profile.summary;
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  checkPageBreak(splitSummary.length * 12);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 12 + 6;

  // 2. Technical Skills
  renderSectionHeader('Core Competencies & Technical Skills');
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);

  const skillLines = [
    { label: 'Databases & Querying', skills: profile.skills.sqlAndDatabases.join(', ') },
    { label: 'Programming & Analysis', skills: profile.skills.programmingAndScripting.join(', ') },
    { label: 'BI & Visualization', skills: profile.skills.biAndVisualization.join(', ') },
    { label: 'Cloud & Warehouses', skills: profile.skills.cloudAndWarehouses.join(', ') },
    { label: 'Analytics & Methods', skills: profile.skills.analyticsAndStatistics.join(', ') }
  ];

  for (const line of skillLines) {
    if (!line.skills) continue;
    checkPageBreak(14);
    doc.setFont('times', 'bold');
    const labelWidth = doc.getTextWidth(`${line.label}: `);
    doc.text(`${line.label}: `, margin, y);
    doc.setFont('times', 'normal');
    const remainingWidth = contentWidth - labelWidth;
    const splitSkills = doc.splitTextToSize(line.skills, remainingWidth);
    doc.text(splitSkills[0], margin + labelWidth, y);
    y += 13;
  }
  y += 4;

  // 3. Work Experience
  renderSectionHeader('Professional Experience');
  for (const exp of tailored.tailoredExperience) {
    const origExp = profile.experience.find(e => e.id === exp.id || e.company === exp.company);
    const dateRange = origExp ? `${origExp.startDate} - ${origExp.current ? 'Present' : origExp.endDate}` : '';
    const location = origExp?.location || '';

    checkPageBreak(25);
    // Role + Company left, Date + Location right
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(`${exp.role} | ${exp.company}`, margin, y);

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    const rightSide = [location, dateRange].filter(Boolean).join(' | ');
    doc.text(rightSide, pageWidth - margin, y, { align: 'right' });
    y += 13;

    // Bullet points
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    for (const b of exp.bullets) {
      const bulletText = b.tailored || b.original;
      const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 14);
      checkPageBreak(bulletLines.length * 11 + 4);
      doc.text('•', margin + 3, y);
      doc.text(bulletLines, margin + 14, y);
      y += bulletLines.length * 11 + 3;
    }
    y += 4;
  }

  // 4. Projects
  if (tailored.tailoredProjects && tailored.tailoredProjects.length > 0) {
    renderSectionHeader('Key Analytics Projects');
    for (const proj of tailored.tailoredProjects) {
      checkPageBreak(22);
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      const projTitle = proj.title;
      doc.text(projTitle, margin, y);

      if (proj.tools && proj.tools.length > 0) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        const toolsText = `Tools: ${proj.tools.join(', ')}`;
        doc.text(toolsText, pageWidth - margin, y, { align: 'right' });
      }
      y += 12;

      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      for (const b of proj.bullets) {
        const bulletText = b.tailored || b.original;
        const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 14);
        checkPageBreak(bulletLines.length * 11 + 4);
        doc.text('•', margin + 3, y);
        doc.text(bulletLines, margin + 14, y);
        y += bulletLines.length * 11 + 3;
      }
      y += 4;
    }
  }

  // 5. Education & Certifications
  if (profile.education.length > 0 || profile.certifications.length > 0) {
    renderSectionHeader('Education & Certifications');
    for (const edu of profile.education) {
      checkPageBreak(15);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.text(edu.degree, margin, y);
      doc.setFont('times', 'normal');
      doc.text(`${edu.institution} (${edu.graduationYear})`, pageWidth - margin, y, { align: 'right' });
      y += 13;
    }

    if (profile.certifications.length > 0) {
      checkPageBreak(15);
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.text('Certifications:', margin, y);
      doc.setFont('times', 'normal');
      const certsText = profile.certifications.map(c => `${c.name} (${c.issuer}, ${c.year})`).join('; ');
      const splitCerts = doc.splitTextToSize(certsText, contentWidth - 80);
      doc.text(splitCerts, margin + 80, y);
      y += splitCerts.length * 12 + 4;
    }
  }

  return doc;
}

export function downloadResumePdf(profile: MasterProfile, tailored: TailoredResumeResult, filename?: string) {
  const doc = generateAtsResumePdf(profile, tailored);
  const cleanName = (profile.personalInfo.fullName || 'Candidate').replace(/\s+/g, '_');
  const cleanCompany = (tailored.companyName || 'TargetCompany').replace(/\s+/g, '_');
  const safeFilename = filename || `${cleanName}_${cleanCompany}_ATS_Resume.pdf`;
  doc.save(safeFilename);
}
