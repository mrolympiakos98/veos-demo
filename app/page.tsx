'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Clipboard, Stethoscope, Home, Users, FileText, Camera, Send, Copy, Check, 
  LogOut, Eye, EyeOff, Trash2, Edit, Save, X, Upload, Download, Mail, Calendar,
  QrCode, MapPin, Phone, Globe, Package, CreditCard, FileDown, Printer, ShoppingCart
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'shoes' | 'socks' | 'innersoles';
  image?: string;
  shopifyVariantId?: string;
  options?: {
    colors?: string[];
    sizes?: string[];
  };
}

interface ProductSelection {
  color?: string;
  size?: string;
  quantity?: number;
}

interface FormData {
  referrerName?: string;
  referrerEmail?: string;
  referrerPhone?: string;
  referrerRole?: string;
  facilityName?: string;
  patientName?: string;
  patientDOB?: string;
  roomNumber?: string;
  patientPhone?: string;
  assessmentFindings?: string[];
  assessmentNotes?: string;
  nokName?: string;
  nokEmail?: string;
  nokPhone?: string;
  nokRelationship?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
}

interface Referral {
  id: string;
  formData: FormData;
  referrerType: string;
  selectedProducts: Product[];
  productSelections: Record<string, ProductSelection>;
  totalCost: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  emailsSent?: {
    nokEmail?: boolean;
    coordinatorEmail?: boolean;
    referrerEmail?: boolean;
  };
  nokEmailContent?: string;
  coordinatorEmailContent?: string;
  progressNoteContent?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'nok' | 'coordinator' | 'referrer';
}

// Demo data with foot-related pun names
const demoProducts: Product[] = [
  { 
    id: '1', 
    name: 'Veos Neos Shoes', 
    price: 280, 
    description: 'Premium offloading shoes with a specialised upper and sole to support foot health',
    category: 'shoes',
    shopifyVariantId: 'shopify-variant-shoes-001',
    options: {
      colors: ['Latte Beige', 'Midnight Black'],
      sizes: Array.from({length: 31}, (_, i) => (35 + i * 0.5).toString())
    }
  },
  { 
    id: '2', 
    name: 'EasyFit GripSocks', 
    price: 20, 
    description: 'Non-slip socks for enhanced stability and safety',
    category: 'socks',
    shopifyVariantId: 'shopify-variant-socks-001',
    options: {
      colors: ['Black', 'White']
    }
  },
  { 
    id: '3', 
    name: 'EasyFit Diabetic Socks', 
    price: 18, 
    description: 'Specialized diabetic foot care socks with seamless construction',
    category: 'socks',
    shopifyVariantId: 'shopify-variant-socks-002',
    options: {
      colors: ['Black', 'White']
    }
  },
  { 
    id: '4', 
    name: 'Cloudthotic Orthotic Innersoles', 
    price: 60, 
    description: 'Supportive innersoles for optimal alignment and comfort',
    category: 'innersoles',
    shopifyVariantId: 'shopify-variant-innersoles-001',
    options: {
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    }
  }
];

// Demo referrals with foot pun names
const demoReferrals: Referral[] = [
  {
    id: '1',
    formData: {
      patientName: 'Kerry Tosis',
      referrerName: 'Dr. Sole Mate',
      referrerEmail: 'sole.mate@footcare.com',
      facilityName: 'Heel Good Nursing Home',
      referrerRole: 'Registered Nurse'
    },
    referrerType: 'nursing-home',
    selectedProducts: [demoProducts[0]],
    productSelections: {'1': {color: 'Latte Beige', size: '38'}},
    totalCost: 280,
    status: 'completed',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-22'),
    emailsSent: { nokEmail: true }
  },
  {
    id: '2',
    formData: {
      patientName: 'Bunion Jack',
      referrerName: 'Dr. Archie Support',
      referrerEmail: 'archie.support@podiatry.com',
      facilityName: 'Toe-tal Care Clinic'
    },
    referrerType: 'allied-health',
    selectedProducts: [demoProducts[0], demoProducts[3]],
    productSelections: {'1': {color: 'Midnight Black', size: '42'}, '4': {size: 'L'}},
    totalCost: 340,
    status: 'approved',
    createdAt: new Date('2024-06-18'),
    updatedAt: new Date('2024-06-19'),
    emailsSent: {}
  },
  {
    id: '3',
    formData: {
      patientName: 'Cal Luss',
      referrerName: 'Plantar Ray',
      referrerEmail: 'plantar.ray@ndis.com',
      facilityName: 'Step Forward NDIS'
    },
    referrerType: 'ndis-worker',
    selectedProducts: [demoProducts[1], demoProducts[2]],
    productSelections: {'2': {color: 'White'}, '3': {color: 'Black'}},
    totalCost: 38,
    status: 'pending',
    createdAt: new Date('2024-06-22'),
    updatedAt: new Date('2024-06-22'),
    emailsSent: { coordinatorEmail: true }
  }
];

// Default demo form data for different referrer types
const getDemoFormData = (referrerType: string): FormData => {
  const baseData = {
    referrerName: '',
    referrerEmail: '',
    referrerPhone: '(02) 8765 4321',
    facilityName: '',
    patientName: '',
    patientDOB: '1945-03-15',
    roomNumber: '12B',
    patientPhone: '(02) 1234 5678',
    assessmentFindings: ['bunions', 'diabetes', 'fragile skin'],
    assessmentNotes: 'Patient requires specialized footwear due to multiple foot complications and mobility concerns.'
  };

  switch (referrerType) {
    case 'nursing-home':
      return {
        ...baseData,
        referrerName: 'Nurse Heel B. Fine',
        referrerEmail: 'heel.fine@toetalliving.com.au',
        referrerRole: 'Registered Nurse',
        facilityName: 'Toe-tal Living Aged Care',
        patientName: 'Anna Tomie',
        nokName: 'Stella Standing',
        nokEmail: 'stella.standing@email.com',
        nokPhone: '0412 345 678',
        nokRelationship: 'daughter'
      };
    case 'allied-health':
      return {
        ...baseData,
        referrerName: 'Dr. Wade Walker',
        referrerEmail: 'wade.walker@footclinic.com.au',
        referrerRole: 'Podiatrist',
        facilityName: 'Step Right Podiatry Clinic',
        patientName: 'Neil Down'
      };
    case 'ndis-worker':
      return {
        ...baseData,
        referrerName: 'Kerry Ng',
        referrerEmail: 'kerry.ng@stepforward.org.au',
        referrerRole: 'NDIS Support Worker',
        facilityName: 'Step Forward NDIS Services',
        patientName: 'Toe Knee',
        coordinatorName: 'Archie Support',
        coordinatorEmail: 'archie.support@ndis.gov.au',
        coordinatorPhone: '1800 800 110'
      };
    case 'hcp-worker':
      return {
        ...baseData,
        referrerName: 'Ankle Beth',
        referrerEmail: 'ankle.beth@homecare.com.au',
        referrerRole: 'Home Care Coordinator',
        facilityName: 'Foot Forward Home Care',
        patientName: 'Dr. Corn Wall',
        coordinatorName: 'Ingrid Groan',
        coordinatorEmail: 'ingrid.groan@hcp.gov.au',
        coordinatorPhone: '1800 422 737'
      };
    default:
      return baseData;
  }
};

// Default email templates
const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Next of Kin Email',
    subject: 'Footwear Recommendation for {patientName}',
    type: 'nok',
    content: `Dear {nokName},

I hope this message finds you well. I am writing to inform you about a footwear recommendation for {patientName} following our recent assessment.

During my evaluation, I identified that {patientName}'s current footwear is not providing suitable support and offloading for his/her foot type. {assessmentFindings} To address this, I recommend the following products:

{productDetails}

Total estimated cost: ${'{totalCost}'}

These products will significantly improve {patientName}'s comfort, mobility, and overall foot health. The fitting has been conducted using the sizes specified above.

To proceed with this recommendation, please click the button below to purchase these recommended products. You can choose to have the products delivered directly to {patientName}'s room or to your address for drop-off.

[PURCHASE RECOMMENDED PRODUCTS]

Instructions for Purchase:
1. Click the purchase button above
2. You will be redirected to the VEOS secure online store
3. Your cart is pre-filled with the recommended products
4. Review the items and delivery options
5. Complete your purchase using the secure checkout
6. Products will be delivered as per your selected option

If you have any questions about the products or need assistance with the purchase, please don't hesitate to contact me.

Kind regards,
{referrerName}
{referrerRole}
{facilityName}
{referrerPhone}`
  },
  {
    id: '2',
    name: 'NDIS Coordinator Email',
    subject: 'NDIS Funding Request - Specialized Footwear for {patientName}',
    type: 'coordinator',
    content: `Dear NDIS Support Coordinator,

I am writing to request funding approval for specialized footwear for {patientName} through their NDIS plan.

Following a comprehensive assessment, I have identified the need for the following products:

{productDetails}

Total funding request: ${'{totalCost}'}

These products are essential for maintaining {patientName}'s mobility, independence, and quality of life. The specialized footwear will address current foot health concerns and prevent potential complications.

Assessment findings include: {assessmentFindings}

Please let me know if you require any additional information to process this funding request.

Regards,
{referrerName}
{referrerRole}
{facilityName}`
  },
  {
    id: '3',
    name: 'HCP Case Manager Email',
    subject: 'HCP Funding Request - Footwear for {patientName}',
    type: 'coordinator',
    content: `Dear HCP Case Manager,

I am writing to request funding approval for specialized footwear for {patientName} through their Home Care Package.

Following a comprehensive assessment, I have identified the need for the following products:

{productDetails}

Total funding request: ${'{totalCost}'}

These products are essential for maintaining {patientName}'s mobility, independence, and quality of life in their home environment.

Assessment findings include: {assessmentFindings}

Please let me know if you require any additional information to process this funding request.

Regards,
{referrerName}
{referrerRole}
{facilityName}`
  }
];

const VEOSReferralSystem = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [referrerType, setReferrerType] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [referrals, setReferrals] = useState<Referral[]>(demoReferrals);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productSelections, setProductSelections] = useState<Record<string, ProductSelection>>({});
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(defaultEmailTemplates);
  
  // Editable content states
  const [editableEmailContent, setEditableEmailContent] = useState('');
  const [editableProgressNote, setEditableProgressNote] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingProgressNote, setIsEditingProgressNote] = useState(false);

  // Demo notification system
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'info'}>>([]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Configuration for Shopify integration (demo)
  const SHOPIFY_STORE_URL = 'https://veos-footwear.myshopify.com';
  
  // Form validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.referrerName && formData.referrerEmail && formData.facilityName && formData.referrerRole);
      case 2:
        return !!formData.patientName;
      case 3:
        return selectedProducts.length > 0;
      default:
        return true;
    }
  };

  // Generate demo Shopify cart URL
  const generateShopifyCartUrl = (products: Product[], selections: Record<string, ProductSelection>) => {
    const cartItems = products.map(product => {
      const selection = selections[product.id] || {};
      const variantId = product.shopifyVariantId || product.id;
      const quantity = selection.quantity || 1;
      return `${variantId}:${quantity}`;
    });
    return `${SHOPIFY_STORE_URL}/cart/${cartItems.join(',')}`;
  };

  // Template processing functions
  const processEmailTemplate = (template: string, formData: FormData, products: Product[], selections: Record<string, ProductSelection>, totalCost: number, cartUrl: string) => {
    const productDetails = products.map(p => {
      const selection = selections[p.id] || {};
      let details = `• ${p.name} - $${p.price}`;
      if (selection.color) details += ` (Color: ${selection.color})`;
      if (selection.size) details += ` (Size: ${selection.size})`;
      details += `\n  ${p.description}`;
      return details;
    }).join('\n\n');

    const assessmentFindings = formData.assessmentFindings?.length 
      ? `Assessment findings included: ${formData.assessmentFindings.join(', ')}.`
      : 'General foot assessment was completed.';

    return template
      .replace(/{patientName}/g, formData.patientName || '[Patient Name]')
      .replace(/{nokName}/g, formData.nokName || '[Next of Kin Name]')
      .replace(/{referrerName}/g, formData.referrerName || '[Referrer Name]')
      .replace(/{referrerRole}/g, formData.referrerRole || '[Professional Role]')
      .replace(/{facilityName}/g, formData.facilityName || '[Facility Name]')
      .replace(/{referrerPhone}/g, formData.referrerPhone ? `Phone: ${formData.referrerPhone}` : '')
      .replace(/{productDetails}/g, productDetails)
      .replace(/{totalCost}/g, `${totalCost.toString()}`)
      .replace(/{assessmentFindings}/g, assessmentFindings)
      .replace(/{shopifyCartLink}/g, cartUrl);
  };

  const generateProgressNote = (formData: FormData, selectedProducts: Product[], productSelections: Record<string, ProductSelection>, referrerType: string) => {
    const today = new Date().toLocaleDateString();
    const selectedProductNames = selectedProducts.map(p => {
      const selection = productSelections[p.id] || {};
      let productString = p.name;
      if (selection) {
        const details = [];
        if (selection.color) details.push(`Color: ${selection.color}`);
        if (selection.size) details.push(`Size: ${selection.size}`);
        if (details.length > 0) {
          productString += ` (${details.join(', ')})`;
        }
      }
      return productString;
    }).join(', ');

    const assessmentFindings = formData.assessmentFindings || [];
    const findingsText = assessmentFindings.length > 0 ? assessmentFindings.join(', ') : 'general foot assessment completed';
    
    if (referrerType === 'nursing-home') {
      return `${today} - Progress Note: Nursing Assessment

Completed footwear assessment for resident ${formData.patientName || '[Patient Name]'}. Following evaluation of current footwear condition and mobility needs, identified requirement for specialized footwear to improve comfort and safety.

Assessment Findings: ${findingsText}

Action Taken:
- Conducted comprehensive foot assessment
- Identified need for: ${selectedProductNames}
- Completed referral to VEOS Healthcare Products
- Next of kin (${formData.nokName || '[NOK Name]'}) to be contacted for approval and payment arrangements

Signed: ${formData.referrerName || '[Nurse Name]'}
Designation: ${formData.referrerRole || 'Registered Nurse'}`;
    } else {
      return `${today} - Clinical Progress Note

Patient: ${formData.patientName || '[Patient Name]'}
Assessment: Footwear and mobility evaluation

Findings: ${findingsText}
- Current footwear inadequate for patient's needs
- Mobility concerns identified requiring specialized footwear intervention

Treatment Plan:
- Referred for: ${selectedProductNames}
- Referral submitted to VEOS Healthcare Products
- Professional fitting recommended

Clinician: ${formData.referrerName || '[Clinician Name]'}
Credentials: ${formData.referrerRole || 'Allied Health Professional'}`;
    }
  };

  // Demo functions
  const simulateEmailSending = async (emailType: string, recipient: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        showNotification(`✉️ Email sent to ${recipient} (${emailType})`, 'success');
        resolve(true);
      }, 1500);
    });
  };

  // Admin Login Component
  const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: 'demo@veos.com', password: 'demo123' });
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setLoginError('');

      try {
        // Demo login - any credentials work
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsAdmin(true);
        setCurrentStep('admin');
        showNotification('Successfully logged into admin panel', 'success');
      } catch (error) {
        setLoginError('Login failed - please try again');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-gray-600 mt-2">Secure access to VEOS management</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-green-700">
                <strong>Demo Access:</strong><br/>
                Email: demo@veos.com<br/>
                Password: demo123
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@veos.com"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setCurrentStep('intro')}
              className="text-gray-500 hover:text-blue-600 text-sm font-medium"
            >
              ← Back to Referral System
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Notification Component
  const NotificationSystem = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-800'
              : 'bg-blue-100 border border-blue-200 text-blue-800'
          } animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Landing Page Component
  const LandingPage = () => {
    const referrerOptions = [
      {
        type: 'nursing-home',
        title: 'Nurse/Manager at Nursing Home',
        subtitle: 'Registered Nurse, Care Manager, or Facility Staff',
        description: 'For nursing home residents where next of kin will approve and pay for products',
        icon: <Home className="w-8 h-8" />,
        color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
      },
      {
        type: 'allied-health',
        title: 'Allied Health Professional',
        subtitle: 'Podiatrist, Physiotherapist, Occupational Therapist',
        description: 'Direct patient care with professional recommendations and direct billing',
        icon: <Stethoscope className="w-8 h-8" />,
        color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
      },
      {
        type: 'ndis-worker',
        title: 'NDIS Worker',
        subtitle: 'NDIS Support Coordinator or Support Worker',
        description: 'NDIS funded products requiring coordinator approval and plan management',
        icon: <Users className="w-8 h-8" />,
        color: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
      },
      {
        type: 'hcp-worker',
        title: 'HCP Worker',
        subtitle: 'Home Care Package Provider or Case Manager',
        description: 'Home Care Package funded products requiring case manager approval',
        icon: <Clipboard className="w-8 h-8" />,
        color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
      }
    ];

    const handleReferrerSelection = (type: string) => {
      setReferrerType(type);
      const demoData = getDemoFormData(type);
      setFormData(demoData);
      
      // Auto-select some products for demo
      if (type === 'nursing-home') {
        setSelectedProducts([products[0]]);
        setProductSelections({'1': {color: 'Latte Beige', size: '38', quantity: 1}});
      } else if (type === 'allied-health') {
        setSelectedProducts([products[0], products[3]]);
        setProductSelections({
          '1': {color: 'Midnight Black', size: '42', quantity: 1},
          '4': {size: 'L', quantity: 1}
        });
      } else if (type === 'ndis-worker') {
        setSelectedProducts([products[1], products[2]]);
        setProductSelections({
          '2': {color: 'White', quantity: 1},
          '3': {color: 'Black', quantity: 1}
        });
      }
      
      setCurrentStep('form');
      setCurrentFormStep(1);
      showNotification(`Demo data loaded for ${type.replace('-', ' ')} referral`, 'info');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">VEOS Healthcare</h1>
                  <p className="text-sm text-gray-600">Professional Referral System - Conference Demo</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentStep('login')}
                className="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Demo Banner */}
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Conference Demo Mode</h3>
                <p className="text-sm text-yellow-700">This is a fully interactive demonstration. All data is simulated and prepopulated with foot-related pun names for entertainment. No real emails will be sent.</p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Footwear Referral System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Submit customized referrals for specialized footwear products with automated documentation, 
              email generation, and seamless purchase integration
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {referrerOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleReferrerSelection(option.type)}
                className={`${option.color} border-2 rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm font-medium mb-3 opacity-90">{option.subtitle}</p>
                    <p className="text-sm opacity-75 leading-relaxed">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* QR Code Information */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">QR Code Access</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  This referral system is designed to be accessed through QR codes on our foot measuring devices. 
                  Simply scan the code with your mobile device, select your professional role above, and complete 
                  the customized referral form with automated documentation and purchase integration.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>Mobile Responsive</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>Auto Email Generation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileDown className="w-4 h-4" />
                    <span>Progress Notes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Purchase Integration</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 VEOS Healthcare Products. Professional Referral System v2.0 - Conference Demo</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Enhanced Referral Form Component
  const ReferralForm = () => {
    const totalSteps = 4;

    const getFormConfig = () => {
      const configs = {
        'nursing-home': {
          title: 'Nursing Home Resident Referral',
          showNextOfKin: true,
          showCoordinator: false,
          coordinatorType: '',
          showProgressNote: true,
          progressNoteType: 'nursing' as const,
          emailRecipient: 'Next of Kin',
          emailTemplateId: '1'
        },
        'allied-health': {
          title: 'Allied Health Professional Referral',
          showNextOfKin: false,
          showCoordinator: false,
          coordinatorType: '',
          showProgressNote: true,
          progressNoteType: 'clinical' as const,
          emailRecipient: 'Patient/Client',
          emailTemplateId: '1'
        },
        'ndis-worker': {
          title: 'NDIS Participant Referral',
          showNextOfKin: false,
          showCoordinator: true,
          coordinatorType: 'NDIS Support Coordinator',
          showProgressNote: false,
          emailRecipient: 'NDIS Coordinator',
          emailTemplateId: '2'
        },
        'hcp-worker': {
          title: 'Home Care Package Referral',
          showNextOfKin: false,
          showCoordinator: true,
          coordinatorType: 'HCP Case Manager',
          showProgressNote: false,
          emailRecipient: 'HCP Case Manager',
          emailTemplateId: '3'
        }
      };
      return configs[referrerType as keyof typeof configs] || configs['allied-health'];
    };

    const config = getFormConfig();

    const handleProductToggle = (product: Product) => {
      setSelectedProducts(prev => {
        const isSelected = prev.find(p => p.id === product.id);
        if (isSelected) {
          const newSelections = {...productSelections};
          delete newSelections[product.id];
          setProductSelections(newSelections);
          return prev.filter(p => p.id !== product.id);
        } else {
          const defaultSelection: ProductSelection = { quantity: 1 };
          setProductSelections({
            ...productSelections,
            [product.id]: defaultSelection
          });
          return [...prev, product];
        }
      });
    };

    const updateProductSelection = (productId: string, field: keyof ProductSelection, value: string | number) => {
      setProductSelections(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]: value
        }
      }));
    };

    const initializeEditableContent = () => {
      const totalCost = selectedProducts.reduce((sum, p) => sum + (p.price * (productSelections[p.id]?.quantity || 1)), 0);
      const cartUrl = generateShopifyCartUrl(selectedProducts, productSelections);
      
      // Initialize email content
      const template = emailTemplates.find(t => t.id === config.emailTemplateId);
      if (template) {
        const emailContent = processEmailTemplate(template.content, formData, selectedProducts, productSelections, totalCost, cartUrl);
        setEditableEmailContent(emailContent);
      }
      
      // Initialize progress note content
      if (config.showProgressNote) {
        const progressNote = generateProgressNote(formData, selectedProducts, productSelections, referrerType);
        setEditableProgressNote(progressNote);
      }
    };

    const submitReferral = async () => {
      setLoading(true);
      setError('');

      try {
        const totalCost = selectedProducts.reduce((sum, p) => sum + (p.price * (productSelections[p.id]?.quantity || 1)), 0);
        
        const newReferral: Referral = {
          id: Date.now().toString(),
          formData,
          referrerType,
          selectedProducts,
          productSelections,
          totalCost,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          emailsSent: {},
          nokEmailContent: config.showNextOfKin ? editableEmailContent : undefined,
          coordinatorEmailContent: config.showCoordinator ? editableEmailContent : undefined,
          progressNoteContent: config.showProgressNote ? editableProgressNote : undefined
        };

        // Simulate email sending
        if (config.showNextOfKin && formData.nokEmail) {
          await simulateEmailSending('Next of Kin Email', formData.nokEmail);
          newReferral.emailsSent!.nokEmail = true;
        }
        
        if (config.showCoordinator && formData.coordinatorEmail) {
          await simulateEmailSending('Coordinator Email', formData.coordinatorEmail);
          newReferral.emailsSent!.coordinatorEmail = true;
        }
        
        setReferrals(prev => [newReferral, ...prev]);
        setCurrentFormStep(5);
        setSuccess('Referral submitted successfully!');
        showNotification('🎉 Referral submitted and emails sent!', 'success');
      } catch (err) {
        setError('Failed to submit referral. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-gray-600">Step {currentFormStep} of {totalSteps} - Demo Mode</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => showNotification('Draft saved (simulated)', 'info')}
                  className="text-gray-500 hover:text-blue-600 flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button 
                  onClick={() => setCurrentStep('intro')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back to Selection
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentFormStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Step 1: Referrer Information */}
            {currentFormStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Referrer Information (Pre-filled for Demo)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.referrerName || ''}
                      onChange={(e) => setFormData({...formData, referrerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Role/Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.referrerRole || ''}
                      onChange={(e) => setFormData({...formData, referrerRole: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={referrerType === 'nursing-home' ? 'e.g., Registered Nurse' : 'e.g., Podiatrist'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.referrerEmail || ''}
                      onChange={(e) => setFormData({...formData, referrerEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@facility.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.referrerPhone || ''}
                      onChange={(e) => setFormData({...formData, referrerPhone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(02) 1234 5678"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization/Facility <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.facilityName || ''}
                      onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter facility or organization name"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentFormStep(2)}
                    disabled={!validateStep(1)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next: Client Information
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Client Information */}
            {currentFormStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Client Information (Pre-filled for Demo)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter client's full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.patientDOB || ''}
                      onChange={(e) => setFormData({...formData, patientDOB: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {referrerType === 'nursing-home' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room/Unit Number</label>
                      <input
                        type="text"
                        value={formData.roomNumber || ''}
                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Room 15A"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.patientPhone || ''}
                      onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(02) 1234 5678"
                    />
                  </div>
                </div>

                {/* Assessment Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Assessment Findings (Pre-selected for Demo)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      'bunions',
                      'pressure injury/history',
                      'arthritis',
                      'clawed toes',
                      'diabetes',
                      'fragile skin',
                      'poor peripheral blood flow/return',
                      'other'
                    ].map((condition) => (
                      <label key={condition} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.assessmentFindings?.includes(condition) || false}
                          onChange={(e) => {
                            const findings = formData.assessmentFindings || [];
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assessmentFindings: [...findings, condition]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assessmentFindings: findings.filter(f => f !== condition)
                              });
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{condition}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Assessment Notes</label>
                    <textarea
                      value={formData.assessmentNotes || ''}
                      onChange={(e) => setFormData({...formData, assessmentNotes: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any additional assessment findings or notes..."
                    />
                  </div>
                </div>

                {/* Next of Kin Section */}
                {config.showNextOfKin && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Next of Kin Information (Pre-filled for Demo)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next of Kin Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nokName || ''}
                          onChange={(e) => setFormData({...formData, nokName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter next of kin's name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={formData.nokRelationship || ''}
                          onChange={(e) => setFormData({...formData, nokRelationship: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select relationship</option>
                          <option value="spouse">Spouse</option>
                          <option value="daughter">Daughter</option>
                          <option value="son">Son</option>
                          <option value="sister">Sister</option>
                          <option value="brother">Brother</option>
                          <option value="niece">Niece</option>
                          <option value="nephew">Nephew</option>
                          <option value="friend">Friend</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NOK Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.nokEmail || ''}
                          onChange={(e) => setFormData({...formData, nokEmail: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="nok@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NOK Phone</label>
                        <input
                          type="tel"
                          value={formData.nokPhone || ''}
                          onChange={(e) => setFormData({...formData, nokPhone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="(02) 1234 5678"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Coordinator Section */}
                {config.showCoordinator && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">{config.coordinatorType} Information (Pre-filled for Demo)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Coordinator Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.coordinatorName || ''}
                          onChange={(e) => setFormData({...formData, coordinatorName: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter coordinator's name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Coordinator Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.coordinatorEmail || ''}
                          onChange={(e) => setFormData({...formData, coordinatorEmail: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="coordinator@provider.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator Phone</label>
                        <input
                          type="tel"
                          value={formData.coordinatorPhone || ''}
                          onChange={(e) => setFormData({...formData, coordinatorPhone: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="(02) 1234 5678"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentFormStep(1)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentFormStep(3)}
                    disabled={!validateStep(2)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Next: Product Selection
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Product Selection */}
            {currentFormStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Select Products</h2>
                <p className="text-gray-600 mb-6">Products have been pre-selected based on your referrer type for demonstration purposes. Feel free to modify the selection.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => {
                    const isSelected = selectedProducts.find(p => p.id === product.id);
                    const selection = productSelections[product.id] || {};
                    
                    return (
                      <div key={product.id} className={`border-2 rounded-xl transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div
                          className="p-6 cursor-pointer"
                          onClick={() => handleProductToggle(product)}
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{product.name}</h4>
                              <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                          <div className="flex justify-center">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isSelected ? '✓ Selected' : 'Click to select'}
                            </span>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="p-6 border-t bg-gray-50">
                            {product.category === 'shoes' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                  <select
                                    value={selection.color || ''}
                                    onChange={(e) => updateProductSelection(product.id, 'color', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select color</option>
                                    {product.options?.colors?.map(color => (
                                      <option key={color} value={color}>{color}</option>
                                    ))}
                                    <option value="both">Both Colors</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">European Size</label>
                                  <select
                                    value={selection.size || ''}
                                    onChange={(e) => updateProductSelection(product.id, 'size', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select size</option>
                                    {product.options?.sizes?.map(size => (
                                      <option key={size} value={size}>{size}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                            
                            {product.category === 'socks' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <select
                                  value={selection.color || ''}
                                  onChange={(e) => updateProductSelection(product.id, 'color', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select color</option>
                                  {product.options?.colors?.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                  ))}
                                  <option value="both">Both Colors</option>
                                </select>
                              </div>
                            )}
                            
                            {product.category === 'innersoles' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                <select
                                  value={selection.size || ''}
                                  onChange={(e) => updateProductSelection(product.id, 'size', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select size</option>
                                  {product.options?.sizes?.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-4">Selected Products</h3>
                    <div className="space-y-3">
                      {selectedProducts.map(product => {
                        const selection = productSelections[product.id] || {};
                        return (
                          <div key={product.id} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{product.name}</span>
                              {selection.color && <span className="text-sm text-gray-600 ml-2">• {selection.color}</span>}
                              {selection.size && <span className="text-sm text-gray-600 ml-2">• Size {selection.size}</span>}
                            </div>
                            <span className="font-bold">${product.price}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-blue-200 pt-3 mt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Cost:</span>
                        <span>${selectedProducts.reduce((sum, p) => sum + p.price, 0)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentFormStep(2)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      initializeEditableContent();
                      setCurrentFormStep(4);
                    }}
                    disabled={!validateStep(3)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Review & Generate Documents
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Generate Documents */}
            {currentFormStep === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Review & Generate Documents</h2>
                <p className="text-gray-600 mb-6">Review the generated content before submitting. All emails are simulated for demonstration.</p>
                
                {/* Referral Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-4">Referral Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p><span className="font-medium">Client:</span> {formData.patientName || 'Not entered'}</p>
                      <p><span className="font-medium">Referrer:</span> {formData.referrerName || 'Not entered'}</p>
                      <p><span className="font-medium">Facility:</span> {formData.facilityName || 'Not entered'}</p>
                      <p><span className="font-medium">Role:</span> {formData.referrerRole || 'Not entered'}</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-medium">Products:</span> {selectedProducts.length} items</p>
                      <p><span className="font-medium">Total Cost:</span> ${selectedProducts.reduce((sum, p) => sum + p.price, 0)}</p>
                      <p><span className="font-medium">Email Recipient:</span> {config.emailRecipient}</p>
                      {formData.assessmentFindings && formData.assessmentFindings.length > 0 && (
                        <p><span className="font-medium">Assessment:</span> {formData.assessmentFindings.length} findings</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editable Email Content */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {config.showNextOfKin ? 'Next of Kin Email' : 'Coordinator Email'} (Simulated)
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        <span>{isEditingEmail ? 'View Preview' : 'Edit Email'}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(editableEmailContent);
                          showNotification('Email content copied to clipboard', 'info');
                        }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <span className="font-medium">Email Content</span>
                    </div>
                    <div className="p-6">
                      {isEditingEmail ? (
                        <div>
                          <textarea
                            value={editableEmailContent}
                            onChange={(e) => setEditableEmailContent(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-96 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Edit email content..."
                          />
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => setIsEditingEmail(false)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => {
                                initializeEditableContent();
                                setIsEditingEmail(false);
                              }}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
                            >
                              Reset to Template
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {editableEmailContent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Editable Progress Note */}
                {config.showProgressNote && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Clinical Progress Note</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEditingProgressNote(!isEditingProgressNote)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          <span>{isEditingProgressNote ? 'View Preview' : 'Edit Note'}</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(editableProgressNote);
                            showNotification('Progress note copied to clipboard', 'info');
                          }}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <span className="font-medium">Progress Note Content</span>
                      </div>
                      <div className="p-6">
                        {isEditingProgressNote ? (
                          <div>
                            <textarea
                              value={editableProgressNote}
                              onChange={(e) => setEditableProgressNote(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              placeholder="Edit progress note..."
                            />
                            <div className="mt-4 flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditingProgressNote(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  const progressNote = generateProgressNote(formData, selectedProducts, productSelections, referrerType);
                                  setEditableProgressNote(progressNote);
                                  setIsEditingProgressNote(false);
                                }}
                                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
                              >
                                Reset to Template
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                            {editableProgressNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shopify Integration Preview */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Purchase Integration (Demo)</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                      <span className="font-medium text-green-800">Shopify Cart Integration Ready</span>
                    </div>
                    <p className="text-green-700 mb-4">
                      A pre-filled shopping cart link has been generated and included in the email. 
                      This demo simulates the Shopify integration - in production, recipients would be redirected to the actual store.
                    </p>
                    <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Demo Cart URL:</p>
                      <code className="text-xs text-gray-600 break-all">
                        {generateShopifyCartUrl(selectedProducts, productSelections)}
                      </code>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          showNotification('🛒 Cart preview opened (simulated)', 'info');
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Preview Cart (Demo)</span>
                      </button>
                      <button
                        onClick={() => {
                          const cartUrl = generateShopifyCartUrl(selectedProducts, productSelections);
                          navigator.clipboard.writeText(cartUrl);
                          showNotification('Cart URL copied to clipboard', 'info');
                        }}
                        className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 text-sm"
                      >
                        Copy Cart URL
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentFormStep(3)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={submitReferral}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting...' : 'Submit Referral & Send Emails (Demo)'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {currentFormStep === 5 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Referral Submitted Successfully!</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Your demo referral has been submitted and simulated emails have been "sent" to {config.emailRecipient}. 
                  In production, real emails would be delivered with the purchase integration links.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="font-semibold mb-4">What happens in production?</h3>
                  <div className="text-left space-y-3">
                    {config.showNextOfKin && (
                      <p className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Next of kin receives an email with product recommendations and direct purchase link</span>
                      </p>
                    )}
                    {config.showCoordinator && (
                      <p className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Coordinator receives funding request for approval</span>
                      </p>
                    )}
                    <p className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Email includes pre-filled Shopify cart link for seamless purchase</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Products are processed and delivered once payment is completed online</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Confirmation emails sent to all parties with tracking information</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setCurrentStep('intro');
                      setCurrentFormStep(1);
                      setFormData({});
                      setSelectedProducts([]);
                      setProductSelections({});
                      setReferrerType('');
                      setEditableEmailContent('');
                      setEditableProgressNote('');
                      setIsEditingEmail(false);
                      setIsEditingProgressNote(false);
                      showNotification('Ready for next demo referral', 'info');
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Try Another Demo Referral
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Summary</span>
                  </button>
                  <button
                    onClick={() => {
                      const summary = `VEOS Demo Referral Summary
Client: ${formData.patientName}
Referrer: ${formData.referrerName}
Products: ${selectedProducts.map(p => p.name).join(', ')}
Total: ${selectedProducts.reduce((sum, p) => sum + p.price, 0)}
Demo Cart URL: ${generateShopifyCartUrl(selectedProducts, productSelections)}`;
                      navigator.clipboard.writeText(summary);
                      showNotification('Demo summary copied to clipboard', 'info');
                    }}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Summary</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Simple Admin Panel for Demo
  const AdminPanel = () => {
    const [adminView, setAdminView] = useState('dashboard');

    const handleLogout = () => {
      setIsAdmin(false);
      setCurrentStep('intro');
      showNotification('Logged out of admin panel', 'info');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">VEOS Admin Panel (Demo)</h1>
                  <p className="text-sm text-gray-600">Manage referrals and view analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentStep('intro')}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <Home className="w-4 h-4" />
                  <span>Referral System</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Dashboard Overview */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Demo Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clipboard className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">Total Referrals</h3>
                    <p className="text-3xl font-bold text-blue-600">{referrals.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-medium text-green-900">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">
                      ${referrals.reduce((sum, r) => sum + r.totalCost, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-medium text-purple-900">Products</h3>
                    <p className="text-3xl font-bold text-purple-600">{products.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Check className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="text-lg font-medium text-orange-900">Completed</h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {referrals.filter(r => r.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Referrals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Demo Referrals</h3>
              <button
                onClick={() => showNotification('📊 Export functionality available in production', 'info')}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export (Demo)</span>
              </button>
            </div>
            <div className="space-y-3">
              {referrals.slice(0, 5).map(referral => (
                <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{referral.formData.patientName}</p>
                    <p className="text-sm text-gray-600">
                      by {referral.formData.referrerName} • {referral.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${referral.totalCost}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      referral.status === 'completed' ? 'bg-green-100 text-green-800' :
                      referral.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      referral.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main App Logic
  if (currentStep === 'login') {
    return (
      <>
        <AdminLogin />
        <NotificationSystem />
      </>
    );
  }

  if (isAdmin && currentStep === 'admin') {
    return (
      <>
        <AdminPanel />
        <NotificationSystem />
      </>
    );
  }

  if (currentStep === 'form') {
    return (
      <>
        <ReferralForm />
        <NotificationSystem />
      </>
    );
  }

  return (
    <>
      <LandingPage />
      <NotificationSystem />
    </>
  );
};

export default VEOSReferralSystem;
