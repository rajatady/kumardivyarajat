import { ContentEditor } from "@/components/cms/ArticleEditor";
import { saveProject } from "@/app/cms/actions";

export default function NewProjectPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-headline text-2xl font-medium tracking-tight text-text mb-6">
        New Project
      </h1>
      <ContentEditor type="project" saveAction={saveProject} />
    </div>
  );
}
