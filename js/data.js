/**
 * AgriTrace 360 - Comprehensive Farm Produce Supply Chain Data
 * Simulates real-time blockchain ledger entries, IoT telemetry, and farm-to-fork provenance.
 */

const DEFAULT_BATCHES = [
  {
    id: "AGRI-2026-MNG-9842",
    name: "Royal Alphonso Mangoes",
    variety: "Ratnagiri GI-Tagged Organic Hapus",
    category: "Tropical Fruit",
    grade: "Grade A+ Export Select",
    badge: "100% Organic Certified",
    image: "assets/images/mango.jpg",
    status: "retail",
    statusLabel: "Available on Shelf",
    trustScore: 99.8,
    harvestDate: "2026-10-23",
    expiryDate: "2026-11-06",
    packaging: "Biodegradable Honeycomb Pulp Box",
    carbonSavings: "-24% CO₂ vs Global Avg",
    waterSaved: "420 Liters (Drip Tech)",
    farmer: {
      name: "Rameshwar Patil",
      role: "Lead Grower & Agronomist",
      farm: "Sunridge Bio-Dynamic Orchards",
      location: "Ratnagiri Coastal Hills, Maharashtra",
      coordinates: "16.9902° N, 73.3120° E",
      experience: "24 Years Organic Cultivation",
      quote: "We hand-pick each mango at sunrise when the natural sap seal forms. No synthetic ripening agents, pure sunlight and soil.",
      tipCount: 184
    },
    specs: {
      brixSweetness: "18.8° Bx (Optimal Peak)",
      weightPerUnit: "265g ± 15g",
      pesticideDetection: "0.00 ppm (128-compound screen)",
      ripenessWindow: "Peak Flavor (Ready to Eat)"
    },
    qrPayload: "AGRI-2026-MNG-9842",
    temperatureThreshold: { min: 10.0, max: 13.5, unit: "°C" },
    stages: [
      {
        id: "stage-1",
        stageIndex: 1,
        title: "Farm Cultivation & Sunrise Harvest",
        facility: "Sunridge Bio-Dynamic Orchards, Block C",
        location: "Ratnagiri, Maharashtra, India",
        coords: [16.9902, 73.3120],
        date: "2026-10-23",
        time: "06:15 IST",
        operator: "Rameshwar Patil (Master Grower)",
        status: "completed",
        badge: "Harvest Verified",
        icon: "sprout",
        metrics: [
          { label: "Soil pH Level", value: "6.4", sub: "Optimal Loam" },
          { label: "Brix Sugar Content", value: "18.8° Bx", sub: "Natural Sweetness" },
          { label: "Solar Insolation", value: "8.4 kWh/m²", sub: "Pre-Harvest Sun" },
          { label: "Harvest Technique", value: "Selective Hand-Snip", sub: "With 2cm stalk" }
        ],
        notes: "Harvest completed under favorable ambient weather (23°C). Crates kept shaded in field collection center.",
        certificates: ["NPOP Organic #IN-ORG-004-981", "GI Tag #GI-AP-2018-01"],
        blockHash: "0x4a9f82d1b73e504c9e88a01f729b8720e77d206f3a1e948270bca55e3917e18b",
        prevHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        id: "stage-2",
        stageIndex: 2,
        title: "Packhouse QA & Ozonated Washing",
        facility: "Ratnagiri Agro-Export Processing Terminal",
        location: "Ratnagiri Logistics Gateway, India",
        coords: [16.9850, 73.3050],
        date: "2026-10-23",
        time: "14:45 IST",
        operator: "Dr. Sunita Kulkarni (Chief QA Inspector)",
        status: "completed",
        badge: "Quality Pass: 99.8%",
        icon: "check-circle",
        metrics: [
          { label: "Sanitization", value: "Ozonated Water (0.8ppm)", sub: "Chemical-free" },
          { label: "Sorting Calibration", value: "Optical NIR Scan", sub: "Uniform density" },
          { label: "Defect Rejection", value: "0.12%", sub: "Composted on-site" },
          { label: "Pre-Cooling", value: "12.0°C Core Temp", sub: "Achieved in 110 min" }
        ],
        notes: "Full residue testing cleared for zero heavy metals and zero pesticide residues. Molded pulp honeycomb packaging applied.",
        certificates: ["ISO 22000 Food Safety", "HACCP Certified Facility"],
        blockHash: "0x8b32dc7460912fbe987103ca4d2e5374826b1070e632870195ad8640f04e55cd",
        prevHash: "0x4a9f82d1b73e504c9e88a01f729b8720e77d206f3a1e948270bca55e3917e18b"
      },
      {
        id: "stage-3",
        stageIndex: 3,
        title: "Cold Chain IoT Storage & Telemetry",
        facility: "Gateway Cold Hub #03 (Automated Climate)",
        location: "Navi Mumbai Cold Logistics Port",
        coords: [18.9890, 73.0297],
        date: "2026-10-24",
        time: "03:30 IST",
        operator: "Automated Climate Sensor IoT-CH-49",
        status: "completed",
        badge: "Zero Temp Breach",
        icon: "thermometer",
        metrics: [
          { label: "Average Chamber Temp", value: "11.6°C", sub: "Target: 11-13°C" },
          { label: "Relative Humidity", value: "89.2% RH", sub: "Moisture lock" },
          { label: "Ethylene Level", value: "< 0.04 ppm", sub: "Catalytic scrubbing" },
          { label: "Sensor Uptime", value: "100.0%", sub: "Zero packet loss" }
        ],
        notes: "Continuously audited via MQTT telemetry sensors. Battery backup verified. No temperature spike detected.",
        certificates: ["GDP Cold Chain Compliance", "Smart Sensor Node Calibrated"],
        blockHash: "0xd1088fa3910c2264ef5820bbac648834901cf414e8726543b593ef0d68b677e4",
        prevHash: "0x8b32dc7460912fbe987103ca4d2e5374826b1070e632870195ad8640f04e55cd"
      },
      {
        id: "stage-4",
        stageIndex: 4,
        title: "Multimodal Cold Freight & Logistics",
        facility: "Maersk Aero Reefer & Ground Transit",
        location: "Mumbai BOM -> London LHR -> M4 Route",
        coords: [51.4700, -0.4543],
        date: "2026-10-25",
        time: "16:20 GMT",
        operator: "Captain R. Harrison (Aero Logistics Lead)",
        status: "completed",
        badge: "Reefer Verified",
        icon: "truck",
        metrics: [
          { label: "Transit Reefer Temp", value: "11.9°C", sub: "Deviation ±0.3°C" },
          { label: "Transit Duration", value: "14.2 Hours", sub: "Direct flight + van" },
          { label: "Vibration Sensor", value: "0.06 G", sub: "Padded air pallets" },
          { label: "Tamper Seal ID", value: "SEAL-UK-9842", sub: "Cryptographic QR" }
        ],
        notes: "Air reefer container held at steady 11.9°C throughout flight and transit. Seal verified intact at London customs.",
        certificates: ["IATA CEIV Fresh", "UK Port Health Clearance"],
        blockHash: "0xf7c489b024ee18596ac04b5f8842e61dc73ba919864e2d334e3415cf7985319a",
        prevHash: "0xd1088fa3910c2264ef5820bbac648834901cf414e8726543b593ef0d68b677e4"
      },
      {
        id: "stage-5",
        stageIndex: 5,
        title: "Retail Freshness Pod & Consumer Shelf",
        facility: "FreshDirect Gourmet Supermarket",
        location: "Kensington High St, London W8 5SA, UK",
        coords: [51.5014, -0.1919],
        date: "2026-10-26",
        time: "10:15 GMT",
        operator: "Markus Davies (Department Manager)",
        status: "active",
        badge: "Active on Shelf",
        icon: "store",
        metrics: [
          { label: "Display Chiller Temp", value: "13.2°C", sub: "Controlled humidity" },
          { label: "Arrival Quality Score", value: "100 / 100", sub: "Flawless arrival" },
          { label: "Shelf Bin Location", value: "Organic Island A-3", sub: "Fresh arrivals" },
          { label: "Freshness Window", value: "11 Days Left", sub: "Optimal sweetness" }
        ],
        notes: "Customer QR traceability display activated. Batch authentic and verified on decentralized provenance ledger.",
        certificates: ["Organic Retail Certification", "Soil Association Approved"],
        blockHash: "0x2e811f05c31498877bc9583b2718e8749e3bf5d491c107e3247bb7c2447999bc",
        prevHash: "0xf7c489b024ee18596ac04b5f8842e61dc73ba919864e2d334e3415cf7985319a"
      }
    ],
    telemetryHistory: [
      { time: "Day 1 - 08:00", temp: 12.0, humidity: 89 },
      { time: "Day 1 - 14:00", temp: 12.3, humidity: 88 },
      { time: "Day 1 - 20:00", temp: 11.9, humidity: 90 },
      { time: "Day 2 - 02:00", temp: 11.6, humidity: 91 },
      { time: "Day 2 - 08:00", temp: 11.8, humidity: 89 },
      { time: "Day 2 - 14:00", temp: 12.1, humidity: 88 },
      { time: "Day 2 - 20:00", temp: 11.7, humidity: 89 },
      { time: "Day 3 - 02:00", temp: 11.9, humidity: 90 },
      { time: "Day 3 - 08:00", temp: 12.2, humidity: 87 },
      { time: "Day 3 - 14:00", temp: 12.4, humidity: 88 },
      { time: "Day 4 - 04:00", temp: 12.0, humidity: 89 },
      { time: "Today - 10:00", temp: 12.6, humidity: 86 }
    ]
  },

  {
    id: "AGRI-2026-LET-4109",
    name: "Hydroponic Butterhead Lettuce",
    variety: "Living Root Crisp Butterhead",
    category: "Leafy Greens",
    grade: "Grade AA Ultra Pure",
    badge: "95% Less Water Used",
    image: "assets/images/lettuce.jpg",
    status: "retail",
    statusLabel: "Available on Shelf",
    trustScore: 99.9,
    harvestDate: "2026-10-25",
    expiryDate: "2026-11-08",
    packaging: "Recycled PLA Breathable Clamshell",
    carbonSavings: "-48% CO₂ (Local Indoor Cultivation)",
    waterSaved: "185 Liters per kilogram",
    farmer: {
      name: "Dr. Elena Vance",
      role: "Lead Controlled-Environment Agronomist",
      farm: "SkyHarvest Indoor Vertical Labs",
      location: "Cambridge AgriTech Corridor, UK",
      coordinates: "52.2053° N, 0.1218° E",
      experience: "12 Years Precision Hydroponics",
      quote: "Our greens never touch soil contaminants or animal runoff. Nutrient water is UV sterilized and 100% recirculated.",
      tipCount: 96
    },
    specs: {
      brixSweetness: "4.2° Bx",
      weightPerUnit: "190g with live root plug",
      pesticideDetection: "0.00 ppm (Zero chemicals ever applied)",
      ripenessWindow: "Living Root (Keeps fresh 14 days)"
    },
    qrPayload: "AGRI-2026-LET-4109",
    temperatureThreshold: { min: 2.0, max: 5.0, unit: "°C" },
    stages: [
      {
        id: "stage-1",
        stageIndex: 1,
        title: "Automated Vertical Harvest & Root Trim",
        facility: "SkyHarvest Vertical Farm #02",
        location: "Cambridge, United Kingdom",
        coords: [52.2053, 0.1218],
        date: "2026-10-25",
        time: "05:00 GMT",
        operator: "Robotic Harvester Alpha-4",
        status: "completed",
        badge: "Cleanroom Harvest",
        icon: "sprout",
        metrics: [
          { label: "Nutrient Solution pH", value: "5.8", sub: "Balanced mineral mix" },
          { label: "EC Electrical Cond.", value: "1.6 mS/cm", sub: "Optimum nitrogen" },
          { label: "LED Spectrum", value: "Far-Red / Deep Blue", sub: "Max crunch index" },
          { label: "Pesticide Application", value: "0.00 ppm", sub: "Zero chemicals" }
        ],
        notes: "Grown in sealed HEPA Class 1000 vertical farm bays. Live root preserved in biodegradable peat plug.",
        certificates: ["Red Tractor Assurance", "BRCGS Food Safety Grade A+"],
        blockHash: "0x117498a44b3ec01d7e29bb8849f120e74819bc29834e019f847291a82746bc92",
        prevHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        id: "stage-2",
        stageIndex: 2,
        title: "Modified Atmosphere Packing (MAP)",
        facility: "Clean Packaging Suite Bay 1",
        location: "Cambridge AgriTech Corridor, UK",
        coords: [52.2100, 0.1250],
        date: "2026-10-25",
        time: "07:30 GMT",
        operator: "Marcus Sterling (Cleanroom Technician)",
        status: "completed",
        badge: "MAP Sealed",
        icon: "check-circle",
        metrics: [
          { label: "Package Gas Mix", value: "3% O₂ / 5% CO₂ / 92% N₂", sub: "Halts oxidation" },
          { label: "Clamshell Material", value: "100% Recycled PLA", sub: "Plant-derived" },
          { label: "Optical Weight Check", value: "192g avg", sub: "Target 190g" },
          { label: "Microbial Swab", value: "Zero Pathogens", sub: "Listeria & E.coli free" }
        ],
        notes: "Nitrogen purge applied to maintain crisp cellular turgor. Heat seal integrity 100% leak-tested.",
        certificates: ["Food Contact Safe (EU 10/2011)", "Compostable Standards EN 13432"],
        blockHash: "0x5391a0c84e1b82736489bcf281940e729a883716d2948201738491bbca384918",
        prevHash: "0x117498a44b3ec01d7e29bb8849f120e74819bc29834e019f847291a82746bc92"
      },
      {
        id: "stage-3",
        stageIndex: 3,
        title: "Rapid Hydro-Chill & Cold Buffer",
        facility: "SkyHarvest Cold Logistics Terminal",
        location: "Cambridge AgriTech Corridor, UK",
        coords: [52.2120, 0.1280],
        date: "2026-10-25",
        time: "10:00 GMT",
        operator: "IoT Telemetry Node Sky-C09",
        status: "completed",
        badge: "Cold Locked",
        icon: "thermometer",
        metrics: [
          { label: "Hydro-Chill Temp", value: "2.8°C", sub: "Target 2.5°C - 3.5°C" },
          { label: "Relative Humidity", value: "93.0% RH", sub: "Anti-wilting humidity" },
          { label: "IoT Sampling Rate", value: "Every 60 sec", sub: "Continuous telemetry" },
          { label: "Thermal Stability", value: "±0.2°C Max Dev", sub: "Ultra-precise" }
        ],
        notes: "Core temperature stabilized within 35 minutes of harvesting. Maintained in darkened low-light cold bay.",
        certificates: ["ISO 14001 Environmental System"],
        blockHash: "0x78a02c48192b0374e6193bb928470a1e8394bc827101847e629381048bcae912",
        prevHash: "0x5391a0c84e1b82736489bcf281940e729a883716d2948201738491bbca384918"
      },
      {
        id: "stage-4",
        stageIndex: 4,
        title: "Zero-Emission Electric Urban Transit",
        facility: "GreenFleet EV Reefer Van #EV-09",
        location: "Cambridge to Central London Route",
        coords: [51.7520, -0.3397],
        date: "2026-10-26",
        time: "06:15 GMT",
        operator: "Liam O'Connor (EcoFleet Driver)",
        status: "completed",
        badge: "Zero Tailpipe Emissions",
        icon: "truck",
        metrics: [
          { label: "Cargo Bay Temp", value: "3.2°C", sub: "Battery-powered chiller" },
          { label: "Transit Distance", value: "58 Miles", sub: "Direct route" },
          { label: "CO₂ Saved", value: "14.8 kg CO₂", sub: "vs Diesel transit" },
          { label: "Transit Duration", value: "1 hr 38 min", sub: "Off-peak morning" }
        ],
        notes: "Telemetry synced via 5G IoT gateway to central ledger. Cargo bay door opened only twice at authorized waypoints.",
        certificates: ["Zero Carbon Urban Logistics Certified"],
        blockHash: "0x9923847e102938bc6293847e6291a0c483726194bcae83920194827104bce91a",
        prevHash: "0x78a02c48192b0374e6193bb928470a1e8394bc827101847e629381048bcae912"
      },
      {
        id: "stage-5",
        stageIndex: 5,
        title: "Misting Shelf & In-Store Availability",
        facility: "Planet Organic Flagship Store",
        location: "Tottenham Court Rd, London W1T 7NE",
        coords: [51.5205, -0.1345],
        date: "2026-10-26",
        time: "08:45 GMT",
        operator: "Chloe Campbell (Store Merchandiser)",
        status: "active",
        badge: "Fresh Today",
        icon: "store",
        metrics: [
          { label: "Display Misting", value: "Ultrasonic Dew Mist", sub: "Every 15 min" },
          { label: "Store Ambient", value: "18.0°C / Display 3.5°C", sub: "Optimal shelf life" },
          { label: "Days from Harvest", value: "1 Day (Super Fresh)", sub: "Harvested yesterday" },
          { label: "Customer Scans", value: "48 Scans today", sub: "High engagement" }
        ],
        notes: "Scannable QR code signage displayed prominently above the greens display. Living roots placed in water reservoir tray.",
        certificates: ["Soil Association Organic Retailer"],
        blockHash: "0x34bc8910293847e610293847bcae83920194827104bce91a82746bc920194827",
        prevHash: "0x9923847e102938bc6293847e6291a0c483726194bcae83920194827104bce91a"
      }
    ],
    telemetryHistory: [
      { time: "Yesterday 06:00", temp: 2.8, humidity: 94 },
      { time: "Yesterday 12:00", temp: 2.9, humidity: 93 },
      { time: "Yesterday 18:00", temp: 3.1, humidity: 92 },
      { time: "Yesterday 23:00", temp: 3.0, humidity: 93 },
      { time: "Today 04:00", temp: 3.2, humidity: 92 },
      { time: "Today 07:00", temp: 3.4, humidity: 90 },
      { time: "Today 10:00", temp: 3.5, humidity: 91 },
      { time: "Today 14:00", temp: 3.5, humidity: 90 }
    ]
  },

  {
    id: "AGRI-2026-AVO-5520",
    name: "Heritage Hass Avocados",
    variety: "Highland Volcanic Soil Hass",
    category: "Subtropical Fruit",
    grade: "Grade 1 FairTrade",
    badge: "Rain-Fed Highland Grove",
    image: "assets/images/avocado.jpg",
    status: "transit",
    statusLabel: "In Cold Transit to Distribution",
    trustScore: 99.4,
    harvestDate: "2026-10-24",
    expiryDate: "2026-11-12",
    packaging: "FSC Certified Kraft Cardboard Trays",
    carbonSavings: "-18% Freight Emissions",
    waterSaved: "620 Liters (Rainwater Catchment)",
    farmer: {
      name: "Mateo & Sofia Morales",
      role: "Cooperative Founders",
      farm: "Valle Verde Agroforestry Cooperative",
      location: "Michoacán Highlands (Elevation: 2,150m)",
      coordinates: "19.4200° N, 102.0600° W",
      experience: "3rd Generation Avocado Stewards",
      quote: "Our trees drink pure mountain rain and thrive under native shade canopies. We never clear ancient forest.",
      tipCount: 231
    },
    specs: {
      brixSweetness: "Dry Matter: 25.8% (Rich Creamy)",
      weightPerUnit: "210g - 235g",
      pesticideDetection: "0.00 ppm Organic Certified",
      ripenessWindow: "Firm (Ripe in 3-4 days)"
    },
    qrPayload: "AGRI-2026-AVO-5520",
    temperatureThreshold: { min: 4.5, max: 7.0, unit: "°C" },
    stages: [
      {
        id: "stage-1",
        stageIndex: 1,
        title: "Highland Forest Shade Harvest",
        facility: "Valle Verde Terrace #08",
        location: "Michoacán Highlands, Mexico",
        coords: [19.4200, -102.0600],
        date: "2026-10-24",
        time: "07:00 CST",
        operator: "Mateo Morales (Co-op Leader)",
        status: "completed",
        badge: "FairTrade Harvest",
        icon: "sprout",
        metrics: [
          { label: "Dry Matter Ratio", value: "25.8%", sub: "Guarantees nutty flavor" },
          { label: "Tree Elevation", value: "2,150 meters", sub: "Alpine air cool" },
          { label: "Canopy Shade", value: "45% Native Pine", sub: "Agroforestry buffer" },
          { label: "Picking Clip", value: "0.5cm Stem Clip", sub: "Protects fruit skin" }
        ],
        notes: "Hand-picked using long-reach canvas baskets to prevent any bruising. Soil tested rich in volcanic minerals.",
        certificates: ["FairTrade USA Certified #FT-9912", "Rainforest Alliance Certified"],
        blockHash: "0x892a0e419b3847e6293847e610293847bcae83920194827104bce91a82746bc9",
        prevHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        id: "stage-2",
        stageIndex: 2,
        title: "Acoustic Firmness QA & Gentle Wash",
        facility: "Cooperative Packing Plant #12",
        location: "Uruapan Industrial Gateway, Mexico",
        coords: [19.4120, -102.0520],
        date: "2026-10-24",
        time: "15:30 CST",
        operator: "Gabriela Ortiz (QA Specialist)",
        status: "completed",
        badge: "Acoustic Test Pass",
        icon: "check-circle",
        metrics: [
          { label: "Acoustic Resonance", value: "98.2 / 100", sub: "Zero internal void" },
          { label: "Natural Carnauba Wax", value: "100% Organic Wax", sub: "Retains moisture" },
          { label: "Pulp Pressure", value: "14.2 lbs/in²", sub: "Safe for transit" },
          { label: "Grading Result", value: "Export Grade #1", sub: "Pristine dark green" }
        ],
        notes: "Non-destructive acoustic frequency scanner confirmed dense, uniform butter texture. Packed into ventilated FSC paperboard trays.",
        certificates: ["GLOBALG.A.P. Certified", "USDA Organic #MX-BIO-142"],
        blockHash: "0x34bc8910293847e610293847bcae83920194827104bce91a82746bc920194827",
        prevHash: "0x892a0e419b3847e6293847e610293847bcae83920194827104bce91a82746bc9"
      },
      {
        id: "stage-3",
        stageIndex: 3,
        title: "Smart Cold Pre-Cooling Buffer",
        facility: "Cold Chamber Terminal C-4",
        location: "Veracruz Maritime Cold Hub",
        coords: [19.1738, -96.1342],
        date: "2026-10-25",
        time: "04:00 CST",
        operator: "IoT Terminal Sensor #MX-TEMP-7",
        status: "completed",
        badge: "Temperature Stabilized",
        icon: "thermometer",
        metrics: [
          { label: "Chamber Temp", value: "5.2°C", sub: "Safe non-chill injury" },
          { label: "Relative Humidity", value: "88.0% RH", sub: "Prevents skin shrivel" },
          { label: "Ethylene Level", value: "< 0.02 ppm", sub: "Ripening paused" },
          { label: "Energy Efficiency", value: "Class A+", sub: "Solar powered facility" }
        ],
        notes: "Fruit brought down to 5.2°C gradually to prevent chilling injury. Controlled atmospheric sensors operating normally.",
        certificates: ["Cold Chain Certified Logistics"],
        blockHash: "0x44910293847e610293847bcae83920194827104bce91a82746bc92019482734bc",
        prevHash: "0x34bc8910293847e610293847bcae83920194827104bce91a82746bc920194827"
      },
      {
        id: "stage-4",
        stageIndex: 4,
        title: "Smart Ocean Reefer Vessel in Transit",
        facility: "Hapag-Lloyd Reefer Container #HLXU-89102",
        location: "Gulf Route to Rotterdam Port (Coordinates: 25.10° N, -87.40° W)",
        coords: [25.1000, -87.4000],
        date: "2026-10-26",
        time: "14:00 UTC",
        operator: "Satellite IoT Node #SAT-HL-882",
        status: "active",
        badge: "Live Satellite Tracking",
        icon: "truck",
        metrics: [
          { label: "Live Reefer Temp", value: "5.4°C", sub: "Threshold 4.5-7.0°C" },
          { label: "Satellite Uplink", value: "Orbcomm L-Band", sub: "Ping every 15 min" },
          { label: "Controlled Atmosphere", value: "5% O₂ / 4% CO₂", sub: "Slows respiration" },
          { label: "Estimated ETA", value: "Oct 31, 2026", sub: "On schedule" }
        ],
        notes: "Real-time telemetry streaming via vessel satellite communication. All container health diagnostics in green.",
        certificates: ["International Maritime Dangerous Goods Exemption", "Organic Seal Intact"],
        blockHash: "0x8823847e102938bc6293847e6291a0c483726194bcae83920194827104bce91a",
        prevHash: "0x44910293847e610293847bcae83920194827104bce91a82746bc92019482734bc"
      },
      {
        id: "stage-5",
        stageIndex: 5,
        title: "Port of Rotterdam Arrival & European Grocers",
        facility: "Green Grocer Distribution Center",
        location: "Rotterdam Maasvlakte, Netherlands",
        coords: [51.9244, 4.4777],
        date: "2026-10-31",
        time: "Pending Arrival",
        operator: "Rotterdam QA Inbound Team",
        status: "pending",
        badge: "Scheduled",
        icon: "store",
        metrics: [
          { label: "Customs Clearance", value: "Automated Pre-Check", sub: "Phytosanitary ready" },
          { label: "Destination Hub", value: "Metro EU Distribution", sub: "Cross-docking" },
          { label: "Expected Freshness", value: "14 Days", sub: "Controlled ripening" },
          { label: "Consumer QR Label", value: "Pre-assigned", sub: "Ready for scan" }
        ],
        notes: "Pending arrival and customs physical verification. Temperature data will merge with smart contract on arrival.",
        certificates: ["EU Organic Equivalency #EC-834/2007"],
        blockHash: "Pending Completion",
        prevHash: "0x8823847e102938bc6293847e6291a0c483726194bcae83920194827104bce91a"
      }
    ],
    telemetryHistory: [
      { time: "Oct 24 10:00", temp: 5.1, humidity: 88 },
      { time: "Oct 24 18:00", temp: 5.3, humidity: 87 },
      { time: "Oct 25 02:00", temp: 5.2, humidity: 89 },
      { time: "Oct 25 10:00", temp: 5.0, humidity: 88 },
      { time: "Oct 25 18:00", temp: 5.3, humidity: 88 },
      { time: "Oct 26 02:00", temp: 5.4, humidity: 87 },
      { time: "Oct 26 10:00", temp: 5.4, humidity: 88 }
    ]
  },

  {
    id: "AGRI-2026-STR-7731",
    name: "Sweet Highland Strawberries",
    variety: "Mara des Bois Heritage Berry",
    category: "Fresh Berries",
    grade: "Extra Sweet Select",
    badge: "Picked at 6:30 AM",
    image: "assets/images/strawberry.jpg",
    status: "retail",
    statusLabel: "Fresh on Display Today",
    trustScore: 99.7,
    harvestDate: "2026-10-26",
    expiryDate: "2026-11-01",
    packaging: "Breathable Wood Veneer Punnet Basket",
    carbonSavings: "-32% Local Electric Courier",
    waterSaved: "95 Liters (Mulched Soil)",
    farmer: {
      name: "Hannah Lindqvist",
      role: "Artisanal Berry Horticulturist",
      farm: "Misty Mountain Berry Meadows",
      location: "Herefordshire Valley, UK",
      coordinates: "52.0564° N, 2.7160° W",
      experience: "16 Years Heritage Berry Breeding",
      quote: "Mara des Bois berries have the perfume of wild alpine strawberries. We pick them only at full crimson ripeness.",
      tipCount: 312
    },
    specs: {
      brixSweetness: "13.4° Bx (Exceptional Sweetness)",
      weightPerUnit: "25g - 32g per berry",
      pesticideDetection: "0.00 ppm Organic Certified",
      ripenessWindow: "Peak Flavor (Consume within 4 days)"
    },
    qrPayload: "AGRI-2026-STR-7731",
    temperatureThreshold: { min: 1.0, max: 3.5, unit: "°C" },
    stages: [
      {
        id: "stage-1",
        stageIndex: 1,
        title: "Morning Dew Hand-Picking",
        facility: "Misty Mountain South Terrace",
        location: "Herefordshire, United Kingdom",
        coords: [52.0564, -2.7160],
        date: "2026-10-26",
        time: "06:30 GMT",
        operator: "Hannah Lindqvist (Farm Founder)",
        status: "completed",
        badge: "Morning Dew Harvest",
        icon: "sprout",
        metrics: [
          { label: "Brix Sweetness", value: "13.4° Bx", sub: "Wild berry aromatic note" },
          { label: "Field Temperature", value: "7.5°C", sub: "Cool morning picking" },
          { label: "Soil Micro-biome", value: "Mycorrhizal inoculated", sub: "Nutrient dense" },
          { label: "Hand Handling", value: "Zero stem tear", sub: "Cut with shears" }
        ],
        notes: "Harvested directly into punnet baskets to minimize any physical touch. Berries inspected for full ruby calyx coverage.",
        certificates: ["Soil Association Organic #GB-ORG-05", "Biodynamic Demeter Certified"],
        blockHash: "0x6184910293847e610293847bcae83920194827104bce91a82746bc920194827a",
        prevHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
        id: "stage-2",
        stageIndex: 2,
        title: "Rapid Forced-Air Blast Chilling",
        facility: "Misty Mountain On-Farm Cold Suite",
        location: "Herefordshire, United Kingdom",
        coords: [52.0580, -2.7180],
        date: "2026-10-26",
        time: "07:45 GMT",
        operator: "Tomás Kovač (Cooling Specialist)",
        status: "completed",
        badge: "Blast Chilled in 40m",
        icon: "check-circle",
        metrics: [
          { label: "Blast Air Temp", value: "1.2°C", sub: "Locked in polyphenols" },
          { label: "Pull-down Speed", value: "40 Minutes", sub: "From 8°C to 1.8°C" },
          { label: "Calyx Vitality", value: "100% Crisp Green", sub: "No dehydration" },
          { label: "Purity Test", value: "Passed", sub: "No wash needed (pesticide-free)" }
        ],
        notes: "Rapid blast chilling slows berry respiration instantly, preserving delicate wild aromatics and antioxidants.",
        certificates: ["HACCP Micro-Facility Certified"],
        blockHash: "0x77910293847e610293847bcae83920194827104bce91a82746bc920194827b",
        prevHash: "0x6184910293847e610293847bcae83920194827104bce91a82746bc920194827a"
      },
      {
        id: "stage-3",
        stageIndex: 3,
        title: "Cold Room Staging & Batch Encryption",
        facility: "Hereford Organic Dispatch Hub",
        location: "Hereford West Bypass, UK",
        coords: [52.0530, -2.7210],
        date: "2026-10-26",
        time: "09:00 GMT",
        operator: "Automated Sensor Node Berry-09",
        status: "completed",
        badge: "IoT Verified",
        icon: "thermometer",
        metrics: [
          { label: "Chamber Ambient", value: "1.8°C", sub: "Constant precision cooling" },
          { label: "Relative Humidity", value: "92.0% RH", sub: "Vapor-balanced" },
          { label: "Smart Ledger Hash", value: "Mined Block #4190", sub: "Cryptographic anchor" },
          { label: "Pulp Firmness", value: "Optimal Turgor", sub: "Firm & juicy" }
        ],
        notes: "Blockchain transaction broadcasted with IoT telemetry signature. QR label printed with batch cryptographic proof.",
        certificates: ["Safe Food Logistics Standard"],
        blockHash: "0x88910293847e610293847bcae83920194827104bce91a82746bc920194827c",
        prevHash: "0x77910293847e610293847bcae83920194827104bce91a82746bc920194827b"
      },
      {
        id: "stage-4",
        stageIndex: 4,
        title: "Direct Ultra-Cold Express Dispatch",
        facility: "Chilled Express Courier Van #CE-04",
        location: "M50 / M5 / M4 Corridor to London",
        coords: [51.8500, -1.9500],
        date: "2026-10-26",
        time: "11:30 GMT",
        operator: "David Wright (Specialist Courier)",
        status: "completed",
        badge: "Express 3-Hour Transit",
        icon: "truck",
        metrics: [
          { label: "Van Chiller Reading", value: "2.1°C", sub: "Stable within 0.3°C" },
          { label: "Transit Duration", value: "2 Hours 45 Min", sub: "Direct farm-to-shop" },
          { label: "Shock Absorption", value: "Air-Suspension Van", sub: "Zero berry bruising" },
          { label: "Cold Integrity", value: "100.0%", sub: "Zero thermal break" }
        ],
        notes: "Same-day express delivery direct from farm gate to London retail shelves in under 5 hours from picking.",
        certificates: ["Express Food Transit Standards"],
        blockHash: "0x99910293847e610293847bcae83920194827104bce91a82746bc920194827d",
        prevHash: "0x88910293847e610293847bcae83920194827104bce91a82746bc920194827c"
      },
      {
        id: "stage-5",
        stageIndex: 5,
        title: "Artisan Pantry & Pastry Grocer Shelf",
        facility: "Daylesford Organic & Artisan Grocer",
        location: "Marylebone High St, London W1U 4QW",
        coords: [51.5190, -0.1510],
        date: "2026-10-26",
        time: "12:45 GMT",
        operator: "Seraphina Vance (Head of Produce)",
        status: "active",
        badge: "Picked Today",
        icon: "store",
        metrics: [
          { label: "Time from Harvest", value: "6 Hours ago", sub: "Ultra-fresh same day" },
          { label: "Display Chiller", value: "2.8°C", sub: "Gentle cool air curtain" },
          { label: "Shelf Stock", value: "32 Punnets", sub: "Limited morning batch" },
          { label: "Aroma Intensity", value: "10 / 10", sub: "Wild strawberry perfume" }
        ],
        notes: "Customer can scan QR code to see this morning's harvest timestamp, temperature log, and send a direct tip to Hannah.",
        certificates: ["Certified B-Corp Retailer", "Soil Association Approved"],
        blockHash: "0xaa910293847e610293847bcae83920194827104bce91a82746bc920194827e",
        prevHash: "0x99910293847e610293847bcae83920194827104bce91a82746bc920194827d"
      }
    ],
    telemetryHistory: [
      { time: "06:30 Harvest", temp: 7.5, humidity: 85 },
      { time: "07:15 Blast Chill", temp: 3.2, humidity: 90 },
      { time: "07:45 Chilled", temp: 1.8, humidity: 92 },
      { time: "09:00 Staged", temp: 1.8, humidity: 92 },
      { time: "10:30 Transit", temp: 2.0, humidity: 91 },
      { time: "11:45 Transit", temp: 2.1, humidity: 91 },
      { time: "12:45 Store Arrived", temp: 2.6, humidity: 90 },
      { time: "15:00 On Shelf", temp: 2.8, humidity: 89 }
    ]
  }
];

// Helper functions for persistent storage
const STORAGE_KEY = "agritrace_batches_db_v1";

function loadBatches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load from localStorage, using defaults", e);
  }
  saveBatches(DEFAULT_BATCHES);
  return DEFAULT_BATCHES;
}

function saveBatches(batches) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

function getBatchById(id) {
  const batches = loadBatches();
  return batches.find(b => b.id.toLowerCase() === id.trim().toLowerCase()) || null;
}

function addBatch(newBatch) {
  const batches = loadBatches();
  batches.unshift(newBatch);
  saveBatches(batches);
  return newBatch;
}

function updateBatch(updatedBatch) {
  const batches = loadBatches();
  const idx = batches.findIndex(b => b.id === updatedBatch.id);
  if (idx !== -1) {
    batches[idx] = updatedBatch;
    saveBatches(batches);
    return true;
  }
  return false;
}
