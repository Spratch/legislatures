import { NextResponse } from "next/server";

type Page = {
  missing?: boolean;
  fullurl?: string;
  extract?: string;
  thumbnail?: {
    source: string;
  };
  langlinks?: {
    lang: string;
    "*": string;
  }[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, lang } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: "Veuillez fournir un mot-clé" },
        { status: 400 }
      );
    }

    // Separate the page title from the section title (WIP ) (erase exchars if needed)
    const [pageTitle, sectionTitle] = keyword.split(" #");
    if (!pageTitle) {
      return NextResponse.json(
        { error: "Nom de la page manquant" },
        { status: 400 }
      );
    }

    // Create the URL for the Wikipedia API and obtain other languages
    const urlFr = `https://fr.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      pageTitle
    )}&prop=extracts|pageimages|info|langlinks&explaintext&inprop=url&exchars=450&pithumbsize=500&format=json&lllang=${lang}`;

    // Fetch the data from Wikipedia
    const responseFr = await fetch(urlFr, {
      next: {
        revalidate: 3600
      }
    });
    if (!responseFr.ok) {
      throw new Error("Erreur lors de la requête à Wikipédia FR");
    }

    const dataFr = await responseFr.json();
    const pagesFr = dataFr.query.pages;
    const pageFr: Page = Object.values(pagesFr)[0];

    if (!pageFr || pageFr.missing) {
      return NextResponse.json({ error: "Page non trouvée" }, { status: 404 });
    }

    // Get the [fr] datas (thumbnail, page URL and extract)
    const thumbnail = pageFr.thumbnail ? pageFr.thumbnail.source : null;
    const pageUrlFr = pageFr.fullurl;
    const fullText = pageFr.extract;

    // Get the first paragraph and trim text in parentheses (and the space before)
    const getFirstParagraph = (text: string) => {
      return text
        .split("\n")[0]
        .replace(/ \([^)]*\)/g, "")
        .replace(/,+/g, ",");
    };
    const firstParagraphFr = getFirstParagraph(fullText);

    // Check if the page has corresponding langlink
    const titleLang = pageFr.langlinks?.[0]?.["*"];
    let firstParagraphLang = null;
    let pageUrlLang = null;

    if (titleLang) {
      const urlLang = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        titleLang
      )}&prop=extracts|info&explaintext&inprop=url&exchars=450&pithumbsize=500&format=json`;

      const responseLang = await fetch(urlLang, {
        next: {
          revalidate: 3600
        }
      });
      if (responseLang.ok) {
        const dataLang = await responseLang.json();
        const pagesLang = dataLang.query.pages;
        const pageLang: Page = Object.values(pagesLang)[0];

        if (pageLang && !pageLang.missing) {
          firstParagraphLang = getFirstParagraph(pageLang.extract);
          pageUrlLang = pageLang.fullurl;
        }
      }
    }

    return NextResponse.json(
      {
        firstParagraphFr,
        thumbnail,
        pageUrlFr,
        firstParagraphLang,
        pageUrlLang
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
