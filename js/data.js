/**
 * Dr. Wilson Menezes Pathology Lab — Clinical Data & Configuration
 * Update clinic metadata, test catalogue, packages, or guidelines here.
 */

window.CLINIC_DATA = {
  clinic: {
    name: 'Dr. Wilson Menezes Pathology Lab',
    doctor: 'Dr. Wilson Menezes',
    qualification: 'M.D. (Pathology), Topiwala National Medical College, Mumbai (1985)',
    distinction: 'Ranked First in Mumbai University at M.D. Pathology Examinations (1985)',
    registration: 'Maharashtra Medical Council — Reg. No. 49541 (1983)',
    establishedYear: 1985,
    phoneDisplay: '+91 80803 65359',
    phoneHref: '+918080365359',
    whatsappNumber: '918080365359',
    addressLine1: 'Shop No. C/1, Garden Colony',
    addressLine2: 'Soonawala Agiary Marg, Behind Canossa High School',
    addressLine3: 'Mahim West, Mumbai – 400016, Maharashtra',
    fullAddress:
      'Shop No. C/1, Garden Colony, Soonawala Agiary Marg, Behind Canossa High School, Mahim West, Mumbai – 400016',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Shop+No.+C+1+Garden+Colony+Soonawala+Agiary+Marg+Behind+Canossa+High+School+Mahim+West+Mumbai+400016',
    hours: {
      openHour: 8,
      closeHour: 19,
      closedDays: [0], // 0 = Sunday
      summary: 'Mon – Sat, 8:00 AM – 7:00 PM',
    },
  },

  categories: [
    { id: 'all', label: 'All Investigations' },
    { id: 'Haematology', label: 'Haematology' },
    { id: 'Biochemistry', label: 'Biochemistry' },
    { id: 'Histopathology', label: 'Histopathology' },
    { id: 'Cytology & FNAC', label: 'Cytology & FNAC' },
    { id: 'Clinical Pathology', label: 'Clinical Pathology' },
    { id: 'Hormones & Serology', label: 'Hormones & Serology' },
  ],

  tests: [
    // Haematology
    {
      id: 'cbc-esr',
      code: 'HAEM-01',
      name: 'Complete Blood Count (CBC) with ESR',
      category: 'Haematology',
      sample: 'Whole Blood (EDTA)',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day (4–6 hrs)',
      description:
        'Comprehensive evaluation of haemoglobin, RBC indices, WBC differential count, platelet count, and erythrocyte sedimentation rate.',
      keywords: 'hb platelets wbc rbc anaemia infection blood count',
    },
    {
      id: 'peripheral-smear',
      code: 'HAEM-02',
      name: 'Peripheral Blood Smear Examination',
      category: 'Haematology',
      sample: 'Whole Blood (EDTA)',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Direct microscopic morphology review of red cells, white cells, and platelets by Dr. Menezes to investigate anaemias and blood disorders.',
      keywords: 'pbs morphology anaemia malarial parasite',
    },
    {
      id: 'hba1c',
      code: 'HAEM-03',
      name: 'HbA1c (Glycated Haemoglobin)',
      category: 'Haematology',
      sample: 'Whole Blood (EDTA)',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Measures average blood glucose control over the preceding 2 to 3 months for diabetes screening and ongoing therapy monitoring.',
      keywords: 'diabetes sugar average 3 months glycemic',
    },
    {
      id: 'coagulation-profile',
      code: 'HAEM-04',
      name: 'Coagulation Profile (PT / INR & aPTT)',
      category: 'Haematology',
      sample: 'Citrated Plasma',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Evaluates blood clotting function for pre-operative clearance, bleeding tendencies, and patients on oral anticoagulants.',
      keywords: 'prothrombin time clotting bleeding warfarin surgery',
    },
    {
      id: 'fever-panel',
      code: 'HAEM-05',
      name: 'Mumbai Monsoon & Acute Fever Panel',
      category: 'Haematology',
      sample: 'Whole Blood & Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day (4–6 hrs)',
      description:
        'Combined screening for CBC with platelet count, Malarial Parasite (smear & antigen), Dengue NS1/IgM, and Typhoid screening.',
      keywords: 'malaria dengue typhoid fever platelets monsoon',
    },

    // Biochemistry
    {
      id: 'blood-sugar-fbs-pp',
      code: 'BIO-01',
      name: 'Blood Glucose — Fasting & Post-Prandial (FBS / PPBS)',
      category: 'Biochemistry',
      sample: 'Fluoride Plasma',
      fasting: '8–10 hrs fasting',
      fastingRequired: true,
      turnaround: 'Same day (2–4 hrs)',
      description:
        'Baseline fasting sugar followed by a sample drawn exactly 2 hours after a normal meal to assess glucose tolerance.',
      keywords: 'fbs ppbs diabetes glucose blood sugar',
    },
    {
      id: 'lipid-profile',
      code: 'BIO-02',
      name: 'Complete Lipid Profile',
      category: 'Biochemistry',
      sample: 'Serum',
      fasting: '10–12 hrs fasting',
      fastingRequired: true,
      turnaround: 'Same day',
      description:
        'Total Cholesterol, HDL, LDL, VLDL, Triglycerides, and cardiac risk ratios to assess cardiovascular and metabolic health.',
      keywords: 'cholesterol triglycerides hdl ldl heart cardiac',
    },
    {
      id: 'lft',
      code: 'BIO-03',
      name: 'Liver Function Test (LFT)',
      category: 'Biochemistry',
      sample: 'Serum',
      fasting: 'Optional (8 hrs preferred)',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Total & Direct Bilirubin, SGOT (AST), SGPT (ALT), Alkaline Phosphatase, GGT, Total Protein, and Albumin/Globulin ratio.',
      keywords: 'jaundice bilirubin sgot sgpt alt ast hepatic liver',
    },
    {
      id: 'kft',
      code: 'BIO-04',
      name: 'Kidney / Renal Function Test (KFT / RFT)',
      category: 'Biochemistry',
      sample: 'Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Serum Creatinine, Blood Urea, BUN, Uric Acid, eGFR estimation, and Serum Electrolytes (Sodium, Potassium, Chloride).',
      keywords: 'creatinine urea renal kidney electrolytes egfr uric acid',
    },
    {
      id: 'iron-ferritin',
      code: 'BIO-05',
      name: 'Iron Studies & Serum Ferritin',
      category: 'Biochemistry',
      sample: 'Serum',
      fasting: '8–10 hrs morning fasting',
      fastingRequired: true,
      turnaround: 'Same day',
      description:
        'Serum Iron, TIBC, Transferrin Saturation, and Ferritin levels to diagnose iron-deficiency anaemia and assess iron reserves.',
      keywords: 'iron tibc ferritin anaemia fatigue hairfall',
    },
    {
      id: 'calcium-phosphorus',
      code: 'BIO-06',
      name: 'Serum Calcium, Phosphorus & Uric Acid',
      category: 'Biochemistry',
      sample: 'Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Evaluates bone mineral balance, parathyroid function, and elevated uric acid associated with gout or joint discomfort.',
      keywords: 'bone joint gout calcium uric acid',
    },

    // Histopathology
    {
      id: 'small-biopsy',
      code: 'HISTO-01',
      name: 'Histopathology — Small / Incisional Biopsy',
      category: 'Histopathology',
      sample: 'Tissue in 10% Formalin',
      fasting: 'Not applicable',
      fastingRequired: false,
      turnaround: '3–5 working days',
      description:
        'Careful grossing, tissue processing, H&E staining, and microscopic diagnostic reporting of endoscopic, skin, cervical, or core biopsies.',
      keywords: 'biopsy tissue cancer tumour endoscopy skin cervical',
    },
    {
      id: 'large-specimen',
      code: 'HISTO-02',
      name: 'Histopathology — Surgical Excision / Large Specimen',
      category: 'Histopathology',
      sample: 'Tissue in 10% Formalin',
      fasting: 'Not applicable',
      fastingRequired: false,
      turnaround: '4–6 working days',
      description:
        'Detailed pathological staging, margin evaluation, and diagnostic reporting for resected surgical specimens (appendix, gallbladder, uterus, cysts, tumours).',
      keywords: 'surgery excision specimen pathology staging margins',
    },
    {
      id: 'second-opinion-slides',
      code: 'HISTO-03',
      name: 'Histopathology Slide & Paraffin Block Review',
      category: 'Histopathology',
      sample: 'Existing Slides / Blocks',
      fasting: 'Not applicable',
      fastingRequired: false,
      turnaround: '2–3 working days',
      description:
        'Independent expert second-opinion microscopic review of previously prepared pathology slides and tissue blocks with clinical correlation.',
      keywords: 'second opinion review blocks slides consultation',
    },

    // Cytology & FNAC
    {
      id: 'fnac',
      code: 'CYTO-01',
      name: 'Fine Needle Aspiration Cytology (FNAC)',
      category: 'Cytology & FNAC',
      sample: 'Clinic Procedure',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: '24–48 hours',
      description:
        'Minimally invasive, office-based cytological sampling of palpable thyroid, lymph node, breast, or soft tissue swellings performed personally by Dr. Menezes.',
      keywords: 'lump swelling thyroid lymph node breast needle biopsy',
    },
    {
      id: 'pap-smear',
      code: 'CYTO-02',
      name: 'Pap Smear (Cervical Cytology Screening)',
      category: 'Cytology & FNAC',
      sample: 'Fixed Smear / LBC Vial',
      fasting: 'Special prep',
      fastingRequired: false,
      turnaround: '2–3 working days',
      description:
        'Routine preventive screening for cervical cellular changes, infections, and early dysplasia reported using the Bethesda system.',
      keywords: 'womens health cervical screening gynaecology cytology',
    },
    {
      id: 'fluid-cytology',
      code: 'CYTO-03',
      name: 'Body Fluid Cytology (Pleural, Ascitic, Urine)',
      category: 'Cytology & FNAC',
      sample: 'Fresh Fluid Container',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: '24–48 hours',
      description:
        'Microscopic cellular evaluation of serous cavity fluids and urine samples to detect inflammatory, infectious, or atypical cells.',
      keywords: 'pleural ascitic fluid urine malignant cells cytology',
    },

    // Clinical Pathology
    {
      id: 'urine-routine',
      code: 'CLIN-01',
      name: 'Complete Urine Routine & Microscopy',
      category: 'Clinical Pathology',
      sample: 'Mid-stream Urine',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day (2–4 hrs)',
      description:
        'Physical, chemical (protein, sugar, ketones, nitrites), and microscopic sediment analysis for urinary tract infections and kidney screening.',
      keywords: 'uti urine routine microscopy protein sugar pus cells',
    },
    {
      id: 'urine-culture',
      code: 'CLIN-02',
      name: 'Urine Culture & Antibiotic Sensitivity',
      category: 'Clinical Pathology',
      sample: 'Sterile Urine Container',
      fasting: 'Before antibiotics',
      fastingRequired: false,
      turnaround: '48–72 hours',
      description:
        'Identifies bacterial pathogens causing urinary tract infection and guides your physician on the most effective targeted antibiotic.',
      keywords: 'uti bacteria culture sensitivity antibiotic infection',
    },
    {
      id: 'stool-routine',
      code: 'CLIN-03',
      name: 'Stool Routine, Microscopy & Occult Blood',
      category: 'Clinical Pathology',
      sample: 'Fresh Stool Sample',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Screening for parasitic ova/cysts, digestive markers, inflammatory cells, and microscopic gastrointestinal bleeding.',
      keywords: 'stool digestion parasites occult blood gut',
    },

    // Hormones & Serology
    {
      id: 'thyroid-profile',
      code: 'ENDO-01',
      name: 'Complete Thyroid Profile (T3, T4, Ultra-Sensitive TSH)',
      category: 'Hormones & Serology',
      sample: 'Serum',
      fasting: 'Morning preferred',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Evaluates thyroid gland function for hypothyroidism, hyperthyroidism, fatigue, weight changes, or routine dose monitoring.',
      keywords: 'tsh t3 t4 thyroid hormone metabolism',
    },
    {
      id: 'vitamin-d-b12',
      code: 'ENDO-02',
      name: 'Vitamin D3 (25-OH Total) & Vitamin B12',
      category: 'Hormones & Serology',
      sample: 'Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day / Next morning',
      description:
        'Assesses two of the most common nutritional deficiencies in urban Mumbai linked to bone strength, nerve health, and energy levels.',
      keywords: 'vitamin d b12 deficiency fatigue tingling bone',
    },
    {
      id: 'crp-ra',
      code: 'ENDO-03',
      name: 'CRP (Quantitative) & Rheumatoid Factor',
      category: 'Hormones & Serology',
      sample: 'Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Inflammatory markers used to assess acute infections, joint inflammation, and autoimmune rheumatological conditions.',
      keywords: 'inflammation arthritis joint pain crp rheumatoid',
    },
    {
      id: 'preop-serology',
      code: 'ENDO-04',
      name: 'Pre-Operative Viral Serology Profile',
      category: 'Hormones & Serology',
      sample: 'Serum',
      fasting: 'Not required',
      fastingRequired: false,
      turnaround: 'Same day',
      description:
        'Standard pre-surgical screening including HIV I & II, HBsAg (Hepatitis B), and Anti-HCV with strict confidentiality.',
      keywords: 'surgery pre-op hiv hbsag hepatitis hcv screening',
    },
  ],

  packages: [
    {
      id: 'pkg-essential',
      audience: 'Adults · Annual Baseline',
      name: 'Essential Annual Health Checkup',
      parameters: '52 Parameters',
      prep: '10–12 hours overnight fasting required',
      summary:
        'A thoughtful yearly baseline covering blood counts, sugar, cholesterol, liver, kidney, thyroid, and urinary health — reviewed directly by Dr. Menezes.',
      includes: [
        'Complete Blood Count (CBC) with ESR',
        'Fasting Blood Sugar (FBS)',
        'Complete Lipid Profile',
        'Liver Function Test (LFT)',
        'Kidney Function Test (KFT)',
        'Thyroid Stimulating Hormone (TSH)',
        'Complete Urine Routine & Microscopy',
      ],
    },
    {
      id: 'pkg-senior',
      audience: 'Age 55+ · Preventive Care',
      name: 'Senior Citizen Comprehensive Panel',
      parameters: '64 Parameters',
      prep: '10–12 hours fasting · Home collection available',
      summary:
        'Designed for older adults in Mahim and neighbouring areas, combining organ profiles with diabetes, bone mineral, and vitamin evaluation.',
      includes: [
        'Complete Blood Count (CBC) & ESR',
        'Fasting Sugar & HbA1c (3-Month Avg)',
        'Complete Lipid Profile',
        'Liver & Kidney Function with Electrolytes',
        'Complete Thyroid Profile (T3, T4, TSH)',
        'Vitamin B12 & Vitamin D3 (25-OH)',
        'Serum Calcium, Uric Acid & Urine Routine',
      ],
    },
    {
      id: 'pkg-diabetes-heart',
      audience: 'Metabolic & Cardiac Monitoring',
      name: 'Diabetes & Heart Care Panel',
      parameters: '34 Parameters',
      prep: '10–12 hours fasting + 2-hour post-meal draw',
      summary:
        'Focused follow-up panel for individuals managing blood sugar, blood pressure, or cholesterol alongside their family physician.',
      includes: [
        'Fasting & Post-Prandial Blood Sugar',
        'HbA1c (Glycated Haemoglobin)',
        'Complete Lipid Profile & Cardiac Ratios',
        'Serum Creatinine, eGFR & Electrolytes',
        'Urine Microalbumin & Routine Microscopy',
        'SGOT & SGPT Liver Baseline',
      ],
    },
    {
      id: 'pkg-womens-wellness',
      audience: 'Women · Energy, Iron & Thyroid',
      name: "Women's Wellness & Thyroid Panel",
      parameters: '42 Parameters',
      prep: '8–10 hours morning fasting preferred',
      summary:
        'Addresses common drivers of fatigue, hair thinning, and bone or thyroid concerns with iron stores, vitamin levels, and full thyroid evaluation.',
      includes: [
        'Complete Blood Count (CBC) & Peripheral Smear',
        'Iron Studies & Serum Ferritin',
        'Complete Thyroid Profile (T3, T4, TSH)',
        'Vitamin D3 & Vitamin B12',
        'Serum Calcium & Phosphorus',
        'Fasting Blood Sugar & Urine Routine',
      ],
    },
  ],

  prepGuides: [
    {
      id: 'prep-fasting',
      title: 'Fasting Blood Tests (Glucose, Lipid Profile, Iron)',
      meta: '8 to 12 hours overnight fasting',
      points: [
        '<strong>Fasting window:</strong> Avoid food, tea, coffee, milk, and juices for 8–10 hours (for Fasting Blood Sugar) or 10–12 hours (for Lipid Profile) prior to sample collection.',
        '<strong>Plain water is encouraged:</strong> You may drink plain water freely — staying hydrated actually makes blood collection easier and more comfortable.',
        '<strong>Routine medications:</strong> Continue essential morning blood pressure or heart medicines with a sip of water unless your physician has specifically advised pausing them. If you take thyroid or diabetes tablets, please confirm timing with your doctor or mention it to our technician.',
        '<strong>Post-Prandial (PP) Sugar:</strong> Note the exact time you begin your meal and return (or schedule the second draw) precisely 2 hours from the start of your meal.',
      ],
    },
    {
      id: 'prep-urine-stool',
      title: 'Urine & Stool Sample Collection',
      meta: 'Clean-catch sterile container',
      points: [
        '<strong>Use a clean sterile container:</strong> Collect a sterile screw-cap container from the clinic beforehand or request one during home collection.',
        '<strong>Mid-stream urine sample:</strong> For routine and culture tests, discard the first few drops of urine, collect the mid-stream portion directly into the container, and close the lid securely.',
        '<strong>For Urine Culture:</strong> Whenever possible, collect the sample before starting antibiotics. Deliver it to the lab within 1–2 hours.',
        '<strong>Stool samples:</strong> Collect a small, marble-sized portion in a dry container, taking care not to mix it with urine or toilet water.',
      ],
    },
    {
      id: 'prep-fnac',
      title: 'Preparing for an FNAC Procedure at the Clinic',
      meta: 'No fasting required · 15–20 minute visit',
      points: [
        '<strong>No fasting needed:</strong> Eat a light, normal meal before coming in for Fine Needle Aspiration Cytology (FNAC).',
        '<strong>Bring relevant records:</strong> Please carry your referring doctor’s prescription along with any recent ultrasound (USG), CT, mammography, or blood reports related to the swelling.',
        '<strong>Blood thinners:</strong> Inform Dr. Menezes before the procedure if you are taking aspirin, clopidogrel, warfarin, or other anticoagulant medicines.',
        '<strong>After the procedure:</strong> FNAC uses a very fine needle and requires minimal downtime — most patients resume normal daily activities immediately.',
      ],
    },
    {
      id: 'prep-histopathology',
      title: 'Submitting Biopsy & Histopathology Specimens',
      meta: 'For patients, surgeons & nursing homes',
      points: [
        '<strong>Proper fixation:</strong> Tissue specimens should be placed immediately in an adequate volume of 10% neutral buffered formalin in a leak-proof, wide-mouthed container.',
        '<strong>Clinical details matter:</strong> Include the patient’s full name, age, specimen site, and the surgeon’s brief clinical or operative note — accurate clinical context ensures the most precise histological interpretation.',
        '<strong>Second-opinion reviews:</strong> When bringing slides or paraffin blocks from another laboratory, kindly bring the original histopathology report and clinical summary.',
      ],
    },
    {
      id: 'prep-reports',
      title: 'Report Turnaround & Delivery',
      meta: 'Printed reports & digital WhatsApp PDF',
      points: [
        '<strong>Routine haematology & biochemistry:</strong> Most routine blood and urine reports are ready the same evening after verification and sign-off by Dr. Wilson Menezes.',
        '<strong>Histopathology & cytology:</strong> Because tissue processing, staining, and thorough microscopic evaluation require unhurried precision, biopsies typically take 3–5 working days (FNAC: 24–48 hours).',
        '<strong>Convenient delivery:</strong> Reports can be collected in person at our Mahim West clinic or received digitally as a verified PDF via WhatsApp/email for easy sharing with your physician.',
      ],
    },
  ],

  whyTrust: [
    {
      title: 'Every report reviewed personally',
      body: 'Unlike high-volume chain laboratories where slides are shipped to distant hubs, Dr. Wilson Menezes personally oversees microscopy, biopsies, and blood profiles right here in Mahim.',
    },
    {
      title: 'Direct access to the pathologist',
      body: 'Have a question about a borderline sugar reading or a biopsy term? Both patients and referring physicians can speak directly with Dr. Menezes without navigating call centres.',
    },
    {
      title: 'Unhurried, gentle sample collection',
      body: 'Blood draws and FNAC visits are never rushed. Our experienced team takes extra care with senior citizens, children, and anyone who feels anxious around needles.',
    },
    {
      title: 'Histopathology & FNAC under one roof',
      body: 'From palpable thyroid or lymph node swellings to surgical excision specimens, tissue reporting is carried out by a Mumbai University 1st-rank M.D. Pathologist.',
    },
    {
      title: 'Generations of Mahim families',
      body: 'Practising in Garden Colony since 1985 means we know our neighbourhood — and many families have trusted us across three generations of routine checkups.',
    },
    {
      title: 'Reachable when it matters',
      body: 'Call or message on WhatsApp between 8:00 AM and 7:00 PM (Mon – Sat) to check fasting rules, reserve a morning home draw, or receive verified PDF reports.',
    },
  ],

  assistantQuickQuestions: [
    {
      id: 'q-hours',
      label: 'When are you open?',
      answer:
        'We are open Monday to Saturday, 8:00 AM to 7:00 PM (closed on Sundays). Fasting blood collection is best done between 8:00 AM and 10:30 AM. For early morning home collection (starting 7:30 AM), please call us the evening before.',
    },
    {
      id: 'q-home',
      label: 'How do I book an appointment?',
      answer:
        'To book a clinic visit, FNAC consultation, or home sample collection across Mahim, Dadar, Matunga, and Bandra West, please call our reception desk directly using any Book Appointment button on this page.',
    },
    {
      id: 'q-fasting',
      label: 'Which tests require fasting?',
      answer:
        'Fasting Blood Sugar (8–10 hrs), Complete Lipid Profile (10–12 hrs), and Iron Studies (8–10 hrs) require overnight fasting. Plain water is encouraged! Tests like CBC, HbA1c, Thyroid (TSH), Kidney Function, Vitamin D/B12, and FNAC do not require fasting.',
    },
    {
      id: 'q-location',
      label: 'Where in Mahim West are you located?',
      answer:
        'Shop No. C/1, Garden Colony, Soonawala Agiary Marg, Behind Canossa High School, Mahim West, Mumbai – 400016 — about 5 minutes from Mahim Junction and just off Lady Jamshedji Road.',
    },
    {
      id: 'q-reports',
      label: 'When will my report be ready?',
      answer:
        'Most routine blood and urine tests (CBC, Sugar, Lipid, LFT, KFT, Thyroid) are ready the same evening after verification by Dr. Menezes. FNAC takes 24–48 hours, and Histopathology biopsies take 3–5 working days.',
    },
  ],
};
