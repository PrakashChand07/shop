import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Pill, ShoppingBag, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

export function Signup() {
  const [step, setStep] = useState(1);
  const [industryType, setIndustryType] = useState<"pharmacy" | "footwear">("pharmacy");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (!industryType) {
        setError("Please select a business type to continue.");
        return;
    }
    setError("");
    setStep(2);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!companyName || !name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const success = await signup(name, email, password, companyName, industryType);
    setLoading(false);

    if (success) {
      navigate("/");
    } else {
      setError("Failed to register. Please try another email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounting & Billing</h1>
          <p className="text-gray-600">Create Your Account</p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="space-y-1 pb-4 bg-white border-b border-gray-100">
            <CardTitle className="text-2xl font-bold text-center">
                {step === 1 ? "Choose Your Business" : "Business Details"}
            </CardTitle>
            <CardDescription className="text-center">
                {step === 1 ? "Select your industry type to customize your experience" : "Tell us about yourself and your company"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            
            {step === 1 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            onClick={() => setIndustryType("pharmacy")}
                            className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center gap-3 transition-all ${industryType === 'pharmacy' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            <div className={`p-3 rounded-full ${industryType === 'pharmacy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Pill className="h-6 w-6" />
                            </div>
                            <span className={`font-semibold ${industryType === 'pharmacy' ? 'text-blue-700' : 'text-gray-700'}`}>Pharmacy</span>
                        </div>
                        
                        <div 
                            onClick={() => setIndustryType("footwear")}
                            className={`cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center gap-3 transition-all ${industryType === 'footwear' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            <div className={`p-3 rounded-full ${industryType === 'footwear' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <span className={`font-semibold ${industryType === 'footwear' ? 'text-blue-700' : 'text-gray-700'}`}>Footwear</span>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <Button
                        onClick={handleNextStep}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
                    >
                        Continue <ArrowRight className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-center text-sm pt-2">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">Sign in</Link>
                    </div>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Company Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="companyName"
                        type="text"
                        placeholder="e.g. City Medicals or Bata Shoes"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 h-11"
                    />
                    </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Your Full Name</Label>
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="name"
                    />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="email"
                    />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                        ) : (
                        <Eye className="h-5 w-5" />
                        )}
                    </button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-11"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                        ) : (
                        <Eye className="h-5 w-5" />
                        )}
                    </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="h-11 px-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </div>
                </form>
            )}
            
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Accounting & Billing. All rights reserved.
        </p>
      </div>
    </div>
  );
}
