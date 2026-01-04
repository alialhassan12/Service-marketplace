import { useEffect, useState } from "react";
import { FileText, Zap, Shield, Info, ArrowRight } from "lucide-react";
import adminStore from "../../store/adminStore";
import toast, { Toaster } from 'react-hot-toast';

// TODO: Replace with database query: SELECT * FROM content_pages WHERE page_type = ?
const fakeContent = {
  faq: {
    id: 1,
    title: "Frequently Asked Questions",
    status: "Published",
    lastUpdated: "Oct 26, 2023",
    content: `# Frequently Asked Questions

## General

**How do I post a new job?**

To post a new job, navigate to your client dashboard and click the "Post a New Job" button. You will be guided through a form to enter all the necessary details, including job description, budget, and required skills. Once submitted, your job will be visible to service providers.

**How are payments handled?**

All payments for remote jobs are processed securely through our platform. Clients fund the project upon hiring a provider, and the funds are held in escrow. The payment is released to the provider only after the client approves the completed work, ensuring a safe transaction for both parties.`,
  },
  terms: {
    id: 2,
    title: "Terms of Service",
    status: "Published",
    lastUpdated: "Oct 25, 2023",
    content: `# Terms of Service

## Agreement to Terms

By accessing and using this platform, you agree to be bound by these Terms of Service...`,
  },
  privacy: {
    id: 3,
    title: "Privacy Policy",
    status: "Published",
    lastUpdated: "Oct 24, 2023",
    content: `# Privacy Policy

## Information We Collect

We collect information that you provide directly to us...`,
  },
  about: {
    id: 4,
    title: "About Us",
    status: "Published",
    lastUpdated: "Oct 23, 2023",
    content: `# About Us

## Our Mission

We connect clients with skilled service providers...`,
  },
};

const contentPages = [
  { key: "faq", label: "Frequently Asked Questions", icon: FileText },
  { key: "terms", label: "Terms of Service", icon: Zap },
  { key: "privacy", label: "Privacy Policy", icon: Shield },
  { key: "about", label: "About Us", icon: Info },
];

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState("faq");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [pageMeta, setPageMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent(selectedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  async function loadContent(pageKey) {
    setLoading(true);
    try {
      const data = await adminStore.fetchContent(pageKey);
      setContent(data.content || "");
      setIsDraft(data.status !== "published");
      setPageMeta(data);
    } catch (err) {
      console.warn("Loading fallback content", err);
      const fallback = fakeContent[pageKey];
      setContent(fallback?.content || "");
      setPageMeta(fallback);
    } finally {
      setLoading(false);
    }
  }

  const currentContent = pageMeta || fakeContent[selectedPage];

  // TODO: Replace with database query: SELECT content FROM content_pages WHERE page_type = ? AND status = 'published'
  const handlePageSelect = (pageKey) => {
    setSelectedPage(pageKey);
    setContent(fakeContent[pageKey].content);
    setIsDraft(false);
    // TODO: Fetch content from API: GET /api/content/${pageKey}
  };

  // TODO: Replace with database query: UPDATE content_pages SET content = ?, status = 'draft' WHERE page_type = ?
  const handleSaveDraft = () => {
    console.log("Saving draft for:", selectedPage);
    setIsDraft(true);
    adminStore
      .saveContent(selectedPage, {
        content,
        status: "draft",
        title: pageMeta?.title || "",
      })
      .then(() => toast.success("Draft saved"))
      .catch((err) => toast.error("Failed to save draft"));
  };

  // TODO: Replace with database query: UPDATE content_pages SET content = ?, status = 'published', last_updated = NOW() WHERE page_type = ?
  const handlePublish = () => {
    console.log("Publishing:", selectedPage);
    setIsDraft(false);
    adminStore
      .saveContent(selectedPage, {
        content,
        status: "published",
        title: pageMeta?.title || "",
      })
      .then(() => toast.success("Published successfully"))
      .catch(() => toast.error("Failed to publish"));
  };

  // TODO: Replace with database query: SELECT content FROM content_pages WHERE page_type = ? AND status = 'published'
  const handlePreview = () => {
    console.log("Previewing:", selectedPage);
    // Very simple preview: open new window and write content as HTML
    const w = window.open("", "_blank");
    w.document.write(
      `<pre style="white-space:pre-wrap; font-family:inherit">${content.replace(
        /</g,
        "&lt;"
      )}</pre>`
    );
    w.document.title = pageMeta?.title || selectedPage;
  };

  return (
    <main className="flex-1 p-6 text-primary">
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Column - Content Selection */}
        <div className="col-span-3">
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-1 text-primary">
              Content Management
            </h2>
            <p className="text-sm text-muted mb-4">
              Select a page to edit its content.
            </p>

            <div className="space-y-2">
              {contentPages.map((page) => {
                const Icon = page.icon;
                const isActive = selectedPage === page.key;
                return (
                  <button
                    key={page.key}
                    onClick={() => handlePageSelect(page.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-card/80 text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm">{page.label}</span>
                    </div>
                    <ArrowRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Content Editor */}
        <div className="col-span-9">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Editing: {currentContent.title}
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <span
                    className={`${
                      currentContent.status === "Published"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    Status: {currentContent.status}
                  </span>
                  <span className="text-muted">
                    Last updated: {pageMeta?.updated_at ? new Date(pageMeta.updated_at).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 bg-card/80 hover:bg-white/5 rounded-xl text-sm transition"
                >
                  Preview
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-card/80 hover:bg-white/5 rounded-xl text-sm transition"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm transition"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-card/80 rounded-lg mb-4 border border-white/5">
              <button className="p-2 hover:bg-white/5 rounded" title="Bold">
                <strong>B</strong>
              </button>
              <button className="p-2 hover:bg-white/5 rounded" title="Italic">
                <em>I</em>
              </button>
              <button
                className="p-2 hover:bg-white/5 rounded"
                title="Underline"
              >
                <u>U</u>
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button
                className="p-2 hover:bg-white/5 rounded"
                title="Unordered List"
              >
                •
              </button>
              <button
                className="p-2 hover:bg-white/5 rounded"
                title="Ordered List"
              >
                1.
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button className="p-2 hover:bg-white/5 rounded" title="Link">
                🔗
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button
                className="p-2 hover:bg-white/5 rounded text-sm"
                title="Heading 1"
              >
                H1
              </button>
              <button
                className="p-2 hover:bg-white/5 rounded text-sm"
                title="Heading 2"
              >
                H2
              </button>
            </div>

            {/* Editor Content Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 bg-card/80 border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
              placeholder="Start editing your content..."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
