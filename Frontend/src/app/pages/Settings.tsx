import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Building2, User as UserIcon, Bell, Printer, Database, Upload, X, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Settings() {
  const { user } = useAuth();
  
  // States
  const [loading, setLoading] = useState(false);
  
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    phone: "",
    industryType: "",
    gstin: "",
    address: { street: "", city: "", state: "", pincode: "", country: "India" },
    logo: "",
    signature: "",
    seal: ""
  });

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch user profile
      const userRes = await api.get('/auth/me');
      if (userRes.data?.success) {
        setUserData({
          name: userRes.data.data.name || "",
          email: userRes.data.data.email || "",
          phone: userRes.data.data.phone || "",
          role: userRes.data.data.role || ""
        });
      }

      // Fetch company profile
      const compRes = await api.get('/company/profile');
      if (compRes.data?.success) {
        setCompanyData(compRes.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch settings data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      await api.put('/company/profile', {
        name: companyData.name,
        email: companyData.email,
        phone: companyData.phone,
        gstin: companyData.gstin,
        address: companyData.address
      });
      toast.success("Business information updated!");
    } catch (error) {
      toast.error("Failed to update business info.");
    }
  };

  const handleUserUpdate = async () => {
    try {
      await api.put('/auth/profile', {
        name: userData.name,
        phone: userData.phone
      });
      toast.success("User profile updated!");
    } catch (error) {
      toast.error("Failed to update user profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill both password fields.");
      return;
    }
    try {
      await api.put('/auth/change-password', passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'signature' | 'seal') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      const res = await api.post(`/company/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${type} uploaded successfully!`);
      if (res.data?.success) {
        setCompanyData(prev => ({ ...prev, [type]: res.data.data[type] }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to upload ${type}.`);
    } finally {
      // Clear the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (type: 'logo' | 'signature' | 'seal') => {
    try {
      const res = await api.delete(`/company/${type}`);
      if (res.data?.success) {
        toast.success(`${type} removed successfully!`);
        setCompanyData(prev => ({ ...prev, [type]: "" }));
      }
    } catch (error) {
      toast.error(`Failed to remove ${type}.`);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business and app settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Business Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input 
                value={companyData.name} 
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Business Type</Label>
              <Input 
                value={companyData.industryType} 
                disabled 
                className="bg-gray-100 uppercase"
              />
              <p className="text-xs text-gray-500">Business type is fixed based on your account profile.</p>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                value={companyData.email} 
                onChange={(e) => setCompanyData({...companyData, email: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                type="tel" 
                value={companyData.phone || ""} 
                onChange={(e) => setCompanyData({...companyData, phone: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input 
                value={companyData.gstin || ""} 
                onChange={(e) => setCompanyData({...companyData, gstin: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                placeholder="Street address..."
                value={companyData.address?.street || ""} 
                onChange={(e) => setCompanyData({
                  ...companyData, 
                  address: { ...companyData.address, street: e.target.value } 
                })} 
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input 
                  placeholder="City"
                  value={companyData.address?.city || ""} 
                  onChange={(e) => setCompanyData({
                    ...companyData, 
                    address: { ...companyData.address, city: e.target.value } 
                  })} 
                />
                <Input 
                  placeholder="State"
                  value={companyData.address?.state || ""} 
                  onChange={(e) => setCompanyData({
                    ...companyData, 
                    address: { ...companyData.address, state: e.target.value } 
                  })} 
                />
              </div>
            </div>

            <Separator />
            
            {/* Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                 {companyData.logo ? (
                    <div className="relative inline-block mb-2">
                      <img src={companyData.logo} alt="Logo" className="w-24 h-24 object-contain border rounded" />
                      <button
                        onClick={() => handleRemoveImage('logo')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors"
                        title="Remove logo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                 ) : (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                       <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                       <span className="text-sm text-gray-700 font-medium d-block">Upload Logo</span>
                       <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, SVG</p>
                       <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(e) => handleImageUpload(e, 'logo')} />
                    </div>
                 )}
              </div>
              <div className="space-y-2">
                <Label>Signature</Label>
                 {companyData.signature ? (
                    <div className="relative inline-block mb-2">
                      <img src={companyData.signature} alt="Signature" className="w-24 h-24 object-contain border rounded" />
                      <button
                        onClick={() => handleRemoveImage('signature')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors"
                        title="Remove signature"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                 ) : (
                   <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium d-block">Upload Signature</span>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, SVG</p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(e) => handleImageUpload(e, 'signature')} />
                   </div>
                 )}
              </div>
              <div className="space-y-2">
                <Label>Company Seal</Label>
                 {companyData.seal ? (
                    <div className="relative inline-block mb-2">
                      <img src={companyData.seal} alt="Seal" className="w-24 h-24 object-contain border rounded" />
                      <button
                        onClick={() => handleRemoveImage('seal')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm transition-colors"
                        title="Remove seal"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                 ) : (
                   <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium d-block">Upload Seal</span>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, SVG</p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(e) => handleImageUpload(e, 'seal')} />
                   </div>
                 )}
              </div>
            </div>

            <Button className="w-full mt-4" onClick={handleCompanyUpdate}>Save Business Changes</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <CardTitle>User Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={userData.email} disabled className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="text" value={userData.phone || ""} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input type="text" value={userData.role} disabled className="bg-gray-100 uppercase" />
              </div>
              <Button className="w-full" onClick={handleUserUpdate}>Update Profile</Button>

              <Separator className="my-4" />
              <h3 className="font-semibold text-sm">Change Password</h3>
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Enter current password" 
                    value={passwordData.currentPassword} 
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Enter new password (min 6 chars)" 
                    value={passwordData.newPassword} 
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={handlePasswordChange}>Change Password</Button>
            </CardContent>
          </Card>

          {/* Notifications Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when products are low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Reminders</Label>
                  <p className="text-sm text-gray-500">Notify about pending payments</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}