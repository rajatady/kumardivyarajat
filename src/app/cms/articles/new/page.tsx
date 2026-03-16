import { ContentEditor } from "@/components/cms/ArticleEditor";
import { saveArticle } from "@/app/cms/actions";

export default function NewArticlePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-headline text-2xl font-medium tracking-tight text-text mb-6">
        New Article
      </h1>
      <ContentEditor type="article" saveAction={saveArticle} />
    </div>
  );
}
