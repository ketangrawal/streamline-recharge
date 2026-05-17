import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tv, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — CableHub" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("CableHub Operator");
  const [gst, setGst] = useState("29ABCDE1234F1Z5");
  const [whatsapp, setWhatsapp] = useState(true);
  const [email, setEmail] = useState(true);
  const [razorpayKey, setRazorpayKey] = useState("");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Company profile, notifications, and integrations"/>
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-5">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                <Tv className="w-7 h-7"/>
              </div>
              <div>
                <h3 className="font-display font-semibold">Company logo</h3>
                <p className="text-xs text-muted-foreground">Used on receipts and the subscriber portal</p>
                <Button size="sm" variant="outline" className="mt-2">Upload new logo</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Company name"><Input value={name} onChange={e => setName(e.target.value)} className="h-10 rounded-xl"/></Field>
              <Field label="GST number"><Input value={gst} onChange={e => setGst(e.target.value)} className="h-10 rounded-xl"/></Field>
              <Field label="Support email"><Input defaultValue="support@cablehub.app" className="h-10 rounded-xl"/></Field>
              <Field label="Support phone"><Input defaultValue="+91 98000 00000" className="h-10 rounded-xl"/></Field>
            </div>
            <SaveBar/>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <Card>
            <Toggle label="WhatsApp notifications" sub="Send recharge & expiry alerts via WhatsApp" v={whatsapp} on={setWhatsapp}/>
            <Toggle label="Email notifications" sub="Receipts and reminders by email" v={email} on={setEmail}/>
            <Toggle label="In-app notifications" sub="Notification center for subscribers" v={true} on={() => {}}/>
            <SaveBar/>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-5">
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Razorpay Key ID"><Input value={razorpayKey} onChange={e => setRazorpayKey(e.target.value)} placeholder="rzp_live_..." className="h-10 rounded-xl"/></Field>
              <Field label="Razorpay Secret"><Input type="password" placeholder="••••••••••••" className="h-10 rounded-xl"/></Field>
              <Field label="UPI ID"><Input defaultValue="operator@upi" className="h-10 rounded-xl"/></Field>
              <Field label="GST %"><Input type="number" defaultValue="18" className="h-10 rounded-xl"/></Field>
            </div>
            <SaveBar/>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-5">
          <Card>
            <h3 className="font-display font-semibold mb-3">Operator users</h3>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Role</th></tr>
              </thead>
              <tbody>
                {[{n:"Operator Admin",e:"admin@cablehub.app",r:"Owner"},{n:"Field Agent",e:"field@cablehub.app",r:"Recharger"}].map(u => (
                  <tr key={u.e} className="border-t border-border"><td className="py-3 font-medium">{u.n}</td><td className="py-3 text-muted-foreground">{u.e}</td><td className="py-3">{u.r}</td></tr>
                ))}
              </tbody>
            </table>
            <Button className="mt-4 bg-gradient-primary text-primary-foreground border-0">Invite user</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
function Toggle({ label, sub, v, on }: { label: string; sub: string; v: boolean; on: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <Switch checked={v} onCheckedChange={on}/>
    </div>
  );
}
function SaveBar() {
  return (
    <div className="mt-6 flex justify-end">
      <Button onClick={() => toast.success("Settings saved")} className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
        <Save className="w-4 h-4 mr-1.5"/> Save changes
      </Button>
    </div>
  );
}
