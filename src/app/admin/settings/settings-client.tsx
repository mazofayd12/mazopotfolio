"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import { updateSettings } from "@/actions/settings";
import { UploadButton } from "@/lib/uploadthing";
import { PremiumImageUploader } from "@/components/admin/premium-image-uploader";

interface SettingItem {
  key: string;
  value: string;
}

interface SettingsClientProps {
  initialSettings: SettingItem[];
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [loading, setLoading] = useState(false);

  // Convert array of settings to a flat key-value object
  const settingsMap = initialSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const [form, setForm] = useState({
    siteName: settingsMap["siteName"] || "Moaz Mohamed Portfolio",
    siteDescription: settingsMap["siteDescription"] || "Premium portfolio website",
    heroName: settingsMap["heroName"] || "Moaz Mohamed",
    heroHeadline: settingsMap["heroHeadline"] || "Digital Product Designer & Software Engineer",
    heroSubheadline: settingsMap["heroSubheadline"] || "I design, develop and launch modern websites, mobile applications, brands and smart IoT systems.",
    aboutBio: settingsMap["aboutBio"] || "Passionate about combining premium visual aesthetics with robust technical architectures.",
    aboutPhoto: settingsMap["aboutPhoto"] || "",
    aboutResume: settingsMap["aboutResume"] || "",
    aboutHighlights: settingsMap["aboutHighlights"] || "5+ years of hands-on experience, 70+ projects delivered worldwide, Full-stack design & development, IoT & embedded systems expertise",
    aboutExperience: settingsMap["aboutExperience"] || "5",
    socialLinkedin: settingsMap["socialLinkedin"] || "",
    socialGithub: settingsMap["socialGithub"] || "",
    socialTwitter: settingsMap["socialTwitter"] || "",
    contactEmail: settingsMap["contactEmail"] || "moaz.mohamed@example.com",
    contactPhone: settingsMap["contactPhone"] || "+20 123 456 7890",
    contactLocation: settingsMap["contactLocation"] || "Cairo, Egypt",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (tabKeys: (keyof typeof form)[]) => {
    setLoading(true);
    const payload = tabKeys.map((key) => ({
      key: String(key),
      value: form[key],
    }));

    try {
      const res = await updateSettings(payload);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Settings saved successfully!");
      }
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-muted">
          Manage site configurations, metadata, hero contents, and social URLs.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="glass border-white/[0.06] bg-white/[0.02] p-1 rounded-lg w-full flex justify-start gap-1 overflow-x-auto">
          <TabsTrigger value="general" className="rounded-md px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">General</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-md px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Hero Section</TabsTrigger>
          <TabsTrigger value="about" className="rounded-md px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">About Section</TabsTrigger>
          <TabsTrigger value="social" className="rounded-md px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Social Links</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-md px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-white">Contact Info</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl mt-4">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">General Configuration</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Site Name</Label>
                  <Input id="siteName" name="siteName" value={form.siteName} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Site Description</Label>
                  <Textarea id="siteDescription" name="siteDescription" value={form.siteDescription} onChange={handleChange} rows={3} className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none" />
                </div>
                <Button onClick={() => handleSave(["siteName", "siteDescription"])} disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-2">
                  <Save className="h-4 w-4" /> Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Section Settings Tab */}
        <TabsContent value="hero">
          <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl mt-4">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Hero Section Contents</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Full Name</Label>
                  <Input id="heroName" name="heroName" value={form.heroName} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroHeadline" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Headline</Label>
                  <Input id="heroHeadline" name="heroHeadline" value={form.heroHeadline} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubheadline" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Subheadline</Label>
                  <Textarea id="heroSubheadline" name="heroSubheadline" value={form.heroSubheadline} onChange={handleChange} rows={3} className="bg-white/[0.01] border-white/[0.06] rounded-xl resize-none" />
                </div>
                <Button onClick={() => handleSave(["heroName", "heroHeadline", "heroSubheadline"])} disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-2">
                  <Save className="h-4 w-4" /> Save Hero Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Settings Tab */}
        <TabsContent value="about">
          <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl mt-4">
            <CardContent className="p-0 space-y-6">
              <h3 className="font-heading text-lg font-bold text-foreground">About Section Customization</h3>
              
              <div className="space-y-4">
                {/* Biography */}
                <div className="space-y-2">
                  <Label htmlFor="aboutBio" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Biography Paragraph</Label>
                  <Textarea id="aboutBio" name="aboutBio" value={form.aboutBio} onChange={handleChange} rows={6} className="bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>

                {/* Experience & Highlights */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="aboutExperience" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Years of Experience</Label>
                    <Input id="aboutExperience" name="aboutExperience" value={form.aboutExperience} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aboutHighlights" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Highlights Checklist (Comma Separated)</Label>
                    <Input id="aboutHighlights" name="aboutHighlights" value={form.aboutHighlights} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" placeholder="e.g. 5+ years experience, 70+ projects..." />
                  </div>
                </div>

                {/* Profile Photo Uploader */}
                <div className="space-y-3 pt-2">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Profile Photo</Label>
                  <PremiumImageUploader
                    value={form.aboutPhoto}
                    onChange={(url) => setForm((prev) => ({ ...prev, aboutPhoto: url }))}
                    endpoint="imageUploader"
                    aspectRatio="square"
                    maxSizeKb={400}
                  />
                </div>

                {/* Resume PDF Uploader */}
                <div className="space-y-3 pt-2 border-t border-white/[0.04]">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Resume PDF File</Label>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative aspect-square w-28 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
                      {form.aboutResume ? (
                        <div className="text-center p-2">
                          <FileText className="h-8 w-8 mx-auto text-primary" />
                          <span className="text-[9px] text-muted line-clamp-1 block mt-1">Resume Set</span>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, aboutResume: "" }))}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                      <UploadButton
                        endpoint="mediaUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            setForm((prev) => ({ ...prev, aboutResume: res[0].url }));
                            toast.success("Resume uploaded successfully!");
                          }
                        }}
                        onUploadError={(err) => {
                          toast.error(`Upload failed: ${err.message}`);
                        }}
                      />
                      <Label htmlFor="aboutResume" className="text-[10px] font-semibold text-muted/60 block mt-2">Or paste resume file URL:</Label>
                      <Input
                        id="aboutResume"
                        name="aboutResume"
                        value={form.aboutResume}
                        onChange={handleChange}
                        className="h-9 bg-white/[0.01] border-white/[0.06] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave(["aboutBio", "aboutPhoto", "aboutResume", "aboutHighlights", "aboutExperience"])} disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-4">
                  <Save className="h-4 w-4" /> Save About Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Settings Tab */}
        <TabsContent value="social">
          <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl mt-4">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Social Profile URLs</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="socialLinkedin" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Linkedin Profile URL</Label>
                  <Input id="socialLinkedin" name="socialLinkedin" type="url" value={form.socialLinkedin} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialGithub" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Github Profile URL</Label>
                  <Input id="socialGithub" name="socialGithub" type="url" value={form.socialGithub} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialTwitter" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Twitter Profile URL</Label>
                  <Input id="socialTwitter" name="socialTwitter" type="url" value={form.socialTwitter} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <Button onClick={() => handleSave(["socialLinkedin", "socialGithub", "socialTwitter"])} disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-2">
                  <Save className="h-4 w-4" /> Save Social Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Settings Tab */}
        <TabsContent value="contact">
          <Card className="glass border-white/[0.05] bg-white/[0.01] p-6 rounded-2xl mt-4">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contact Email Address</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contact Phone / WhatsApp</Label>
                  <Input id="contactPhone" name="contactPhone" value={form.contactPhone} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactLocation" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contact Location</Label>
                  <Input id="contactLocation" name="contactLocation" value={form.contactLocation} onChange={handleChange} className="h-11 bg-white/[0.01] border-white/[0.06] rounded-xl" />
                </div>
                <Button onClick={() => handleSave(["contactEmail", "contactPhone", "contactLocation"])} disabled={loading} className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl gap-2 mt-2">
                  <Save className="h-4 w-4" /> Save Contact Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
