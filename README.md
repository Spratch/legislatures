# Legislatures Visualization

An interactive visualization tool tracking the composition and evolution of some countries legislative assemblies through time.
[See it live.](https://legislatures.vercel.app/)

## Overview

This project aims to provide a clear and interactive visualization of how legislative assemblies have evolved, showing political parties, coalitions, and their relative strength over different periods.

## Features

- Interactive timeline of legislatures
- Political party visualization with proportional representation
- Contextual timeline aside the main visualization
- Detailed information about parties and political movements
- Filter appearing currents on the graph
- Random filtering
- Hide/show transitions between legislatures
- Responsive design for all devices
- Screen reader accessibility
- Motion animations for transitions

## Technical Stack

- Next.js 13
- TypeScript
- D3.js (Data visualization)
- Framer Motion (Animations)
- TailwindCSS (Styling)

## Project Structure

```
legislatures/
├── app/                   # Next.js app directory
│   └── api/               # Wikipedia api service
├── components/
│   ├── appUi/             # UI components
│   ├── chart/             # Visualization components
│   └── utils/             # Utility components and hooks
├── public/                # Static assets
│   └── data/              # JSON data files
└── types/                 # TypeScript type definitions
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Spratch/legislatures.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## How to Contribute

### Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Follow these guidelines:

- Write clean, documented code
- Follow the existing code style
- Add types for TypeScript
- Test your changes
- Name your commits with the [Angular commit message convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

### Data Contributions

Data files are located in `public/data/` directory. To add or update data:

1. Follow the existing JSON schema
2. Verify historical accuracy
3. Include reliable sources with a "source" key
4. Submit a pull request with your changes

## Data Structure

There are multiple data files, which contain multiple data types:

```
legislatures/
└── public/data/[country]
    ├── events.json             # List of historical events (avoid more than one per year)
    │
    ├── regimes.json            # List of regimes
    │   └── legislatures        # List of regime legislatures
    │       └── parties         # List of parties elected during this legislature
    │
    └── families.json           # List of political currents families
    │   └── currents            # List of political currents associated with this family
    │       └── parties         # List of parties associated with this current
    │
    └── infos.json              # Content for the info modal
```

Parties are both in `regimes.json` and `families.json` using the same id (`name`).
In `regimes.json`, give the id (`name`), and the temporary datas:

- Number of deputies
- If the party is part of a coalition, name it

In `families.json`, the id (`name`) associate the party with a current and its datas, but also with the party untemporal datas:

- Full name
- Keyword (Wikipedia article name)

Each entity requires specific mandatory fields (refer to TypeScript types).

For `infos.json`, use [Portable Text](https://www.portabletext.org/) to get json for each section part and for each translation.

## Accessibility

Accessibility is a core focus:

- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Motion reduction support
- Alternative text for visualizations

## Contact

For questions or suggestions, please open an issue on GitHub.
