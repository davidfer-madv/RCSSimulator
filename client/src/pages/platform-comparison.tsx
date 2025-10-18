import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { PlatformComparisonGuide } from "@/components/image-formatter/platform-comparison-guide";
import { MediaSizeReference } from "@/components/image-formatter/media-size-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlatformComparison() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page Header */}
              <div className="pb-5 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Platform Comparison</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Understand how your RCS messages will appear on Android vs iOS devices
                </p>
              </div>

              {/* Platform Comparison Guide */}
              <div className="mt-6">
                <PlatformComparisonGuide />
              </div>

              {/* Media Size Reference */}
              <div className="mt-6">
                <MediaSizeReference />
              </div>

              {/* Best Practices Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>📚 Quick Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-sm mb-3 text-gray-900">Character Limits</h3>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex justify-between">
                          <span>Title (Android):</span>
                          <span className="font-mono">200 chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Title (iOS visible):</span>
                          <span className="font-mono text-amber-600">~60 chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Title (iOS single-line):</span>
                          <span className="font-mono text-blue-600">102 chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Description (Android):</span>
                          <span className="font-mono">2000 chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Description (iOS):</span>
                          <span className="font-mono text-amber-600">~144 chars</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3 text-gray-900">Image Formats</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>JPEG/JPG - Both platforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>PNG - Both platforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>GIF - Android only</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600">⚠</span>
                          <span>WebP - Limited iOS support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">✗</span>
                          <span>GIF - Not supported on iOS</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3 text-gray-900">Action Limits</h3>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex justify-between">
                          <span>Suggested Actions:</span>
                          <span className="font-mono">Max 4</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Suggested Replies:</span>
                          <span className="font-mono">Max 11</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Android display:</span>
                          <span className="text-green-600">All inline</span>
                        </div>
                        <div className="flex justify-between">
                          <span>iOS display (1 CTA):</span>
                          <span className="text-green-600">Inline</span>
                        </div>
                        <div className="flex justify-between">
                          <span>iOS display (2+ CTAs):</span>
                          <span className="text-amber-600">Dropdown list</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

