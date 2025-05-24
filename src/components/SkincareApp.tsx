import React, { useState, useRef } from 'react';
import { saveEmailSubscriber, saveAnalysis } from '@/lib/supabase';
import jsPDF from 'jspdf';
import {
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
  Eye,
  BarChart3,
  Award,
  Calendar,
  User,
  Star,
  MessageCircle,
  Shield,
  Download,
  Info,
  Droplets,
  Target,
  Sun
} from 'lucide-react';

const SkincareApp = () => {
  const [currentStep, setCurrentStep] = useState('landing');
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(1);
  const [photos, setPhotos] = useState({
    front: null,
    left: null,
    right: null,
    closeup: null
  });
  const [questionnaire, setQuestionnaire] = useState({
    skinType: '',
    concerns: [],
    age: '',
    routine: '',
    environment: ''
  });
  const [userEmail, setUserEmail] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [routine, setRoutine] = useState({
    morning: [],
    evening: []
  });
  const [showSignup, setShowSignup] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState({});
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRefs = {
    front: useRef(),
    left: useRef(),
    right: useRef(),
    closeup: useRef()
  };

  const TOTAL_PRE_ANALYSIS_STEPS = 9;

  const ProgressBar = ({ current, total }) => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Step {current} of {total}</span>
        <span className="text-sm text-gray-600">{Math.round((current / total) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-pink-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );

  const analyzePhotos = async () => {
    setCurrentStep('analyzing');
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      const enhancedAnalysis = {
        overallScore: 72,
        skinType: questionnaire.skinType || 'ORPW',
        detailedMetrics: {
          oily: questionnaire.skinType === 'oily' ? 65 : 52,
          resistant: 41,
          pigmented: questionnaire.concerns.includes('pigmentation') ? 45 : 27,
          wrinkled: questionnaire.age === '35-44' || questionnaire.age === '45+' ? 70 : 35,
          dry: questionnaire.skinType === 'dry' ? 60 : 0,
          sensitive: questionnaire.skinType === 'sensitive' ? 55 : 0,
          nonPigmented: 0,
          tight: 0
        },
        subSkinTypes: {
          acneProne: questionnaire.concerns.includes('acne') ? 65 : 0,
          acneResistant: 8,
          darkCircles: 0,
          brightCircles: 58
        },
        concerns: [
          { type: 'Dermatopathy', severity: 'Moderate', area: '67.52cm²', percentage: 15 },
          { type: 'Sensitivity & Redness', severity: 'Mild', area: '48.62cm²', percentage: 8 },
          { type: 'Fine Lines & Wrinkles', severity: 'Moderate', count: 15, length: '12.62cm' },
          { type: 'Large Pores', severity: 'Moderate', count: 42, percentage: 12 },
          { type: 'Pigmentation & Dark Spots', severity: 'Significant', area: '97.84cm²', percentage: 23 },
          { type: 'Blackheads', severity: 'High', count: 127, percentage: 18 },
          { type: 'Oily T-Zone', severity: 'Moderate', percentage: 14 }
        ],
        comparisonData: {
          betterThan: 68,
          worseUser: 32,
          avgIndianSkinScore: 64,
          yourRanking: '32nd percentile',
          commonIssuesInIndia: ['Pigmentation (78%)', 'Oily Skin (65%)', 'Blackheads (52%)', 'Sun Damage (71%)']
        },
        recommendations: [
          'Use oil-control products with niacinamide',
          'Daily SPF 50+ is crucial for Indian climate',
          'Incorporate gentle chemical exfoliation (BHA)',
          'Focus on pigmentation control with vitamin C',
          'Hydrating toner for oily but dehydrated skin'
        ],
        confidenceScore: 94
      };
      // Save to DB (optional, can be commented if not needed)
      try {
        await saveAnalysis({
          user_email: userEmail,
          skin_type: enhancedAnalysis.skinType,
          overall_score: enhancedAnalysis.overallScore,
          confidence_score: enhancedAnalysis.confidenceScore,
          concerns: enhancedAnalysis.concerns,
          detailed_metrics: enhancedAnalysis.detailedMetrics,
          questionnaire_data: questionnaire,
          analysis_status: 'completed'
        });
        await saveEmailSubscriber(userEmail);
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
      setAnalysis(enhancedAnalysis);
      setCurrentStep('results');
    } catch (error) {
      console.error('Analysis error:', error);
      setCurrentStep('results');
    }
  };

  const handlePhotoUpload = (angle, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => ({
          ...prev,
          [angle]: { file, preview: e.target.result, uploaded: true }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const allPhotosUploaded = Object.values(photos).every(photo => photo?.uploaded);

  const generateRoutine = () => {
    const enhancedRoutine = { /* ... routine data ... */ };
    setRoutine(enhancedRoutine);
    setCurrentStep('routine');
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* ... LandingPage JSX ... */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              SkinAI Pro
            </span>
          </div>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Sign In
          </button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            India's Most Advanced
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent block">
              AI Skin Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get professional-grade skin analysis designed for Indian skin types. Compare with 50,000+ users and get personalized product recommendations within minutes.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4"><Eye className="h-6 w-6 text-pink-600" /></div><h3 className="font-semibold text-gray-900 mb-2">7 Skin Issues</h3><p className="text-gray-600 text-sm">Detailed analysis of common Indian skin problems</p></div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4"><BarChart3 className="h-6 w-6 text-blue-600" /></div><h3 className="font-semibold text-gray-900 mb-2">Population Comparison</h3><p className="text-gray-600 text-sm">See how your skin compares to others</p></div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4"><Award className="h-6 w-6 text-green-600" /></div><h3 className="font-semibold text-gray-900 mb-2">Expert Products</h3><p className="text-gray-600 text-sm">Curated recommendations for Indian market</p></div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4"><Calendar className="h-6 w-6 text-purple-600" /></div><h3 className="font-semibold text-gray-900 mb-2">1-on-1 Consultation</h3><p className="text-gray-600 text-sm">Book expert consultation with Ishika</p></div>
          </div>
          <button onClick={() => setCurrentStep('consent')} className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 mb-8">
            Start Your Free Analysis
          </button>
          <p className="text-sm text-gray-500">
            ✨ Free comprehensive analysis • 🔒 Privacy protected • ⚡ Results in 60 seconds
          </p>
        </div>
      </main>
    </div>
  );

  const ConsentPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
        <ProgressBar current={1} total={TOTAL_PRE_ANALYSIS_STEPS} />
        {/* ... existing ConsentPage JSX ... */}
        <div className="text-center mb-6"><Sparkles className="h-16 w-16 text-pink-500 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-900 mb-2">We Care About Your Privacy</h2></div>
        <div className="space-y-4 text-gray-600 mb-6"><p>Before we begin your Face Analysis, we want to make sure you understand that our application requires certain information like an image of your face to work. Please read more about our terms and conditions below.</p><div className="bg-gray-50 rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">This Face Analysis tool collects information and photos of your face and skin, along with:</h3><ul className="space-y-1 text-sm"><li>• Descriptions of skin health conditions, concerns, and product recommendations</li><li>• Analysis using AI technology and statistical algorithms</li><li>• Comparison with database of 50,000+ Indian users</li><li>• Personalized skincare routine recommendations</li></ul></div></div>
        <div className="space-y-4"><label className="flex items-start space-x-3"><input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mt-1" /><span className="text-sm text-gray-600">I consent to the collection and processing of my facial images and personal information for skin analysis purposes. I understand this data will be used to provide personalized recommendations and may be anonymized for improving the service.</span></label><button onClick={() => consentGiven && setCurrentStep('welcome')} disabled={!consentGiven} className={`w-full py-3 rounded-lg font-semibold transition-colors ${ consentGiven ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed' }`}>I CONSENT</button></div>
      </div>
    </div>
  );

  const WelcomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center">
        <ProgressBar current={2} total={TOTAL_PRE_ANALYSIS_STEPS} />
        {/* ... existing WelcomePage JSX ... */}
        <div className="mb-8"><div className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"><Sparkles className="h-10 w-10 text-white" /></div><h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Advanced Skin Journey!</h1><p className="text-xl text-gray-600">Let's start by understanding your skin better with a few quick questions.</p></div>
        <div className="space-y-4 mb-8"><div className="flex items-start space-x-3"><div className="bg-blue-100 p-2 rounded-full flex-shrink-0"><Info className="h-5 w-5 text-blue-600" /></div><div className="text-left"><h3 className="font-semibold text-gray-900">How it works</h3><p className="text-gray-600 text-sm">Answer 5 quick questions, upload photos, and get AI-powered analysis</p></div></div><div className="flex items-start space-x-3"><div className="bg-green-100 p-2 rounded-full flex-shrink-0"><Shield className="h-5 w-5 text-green-600" /></div><div className="text-left"><h3 className="font-semibold text-gray-900">Your privacy matters</h3><p className="text-gray-600 text-sm">Photos are analyzed securely and never stored</p></div></div><div className="flex items-start space-x-3"><div className="bg-pink-100 p-2 rounded-full flex-shrink-0"><Sparkles className="h-5 w-5 text-pink-600" /></div><div className="text-left"><h3 className="font-semibold text-gray-900">Get personalized results</h3><p className="text-gray-600 text-sm">Receive detailed analysis with Indian climate-specific recommendations</p></div></div></div>
        <button onClick={() => { setCurrentStep('questionnaire'); setCurrentQuestionStep(1);}} className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center mx-auto">Let's Get Started <ChevronRight className="ml-2 h-5 w-5" /></button>
      </div>
    </div>
  );

  const QuestionnairePage = () => {
    const questions = [
      { step: 1, key: 'skinType', question: "What's your skin type?", icon: <Droplets className="h-8 w-8 text-blue-500" />, options: [ { value: 'oily', label: 'Oily', description: 'Shiny, prone to acne' }, { value: 'dry', label: 'Dry', description: 'Flaky, tight feeling' }, { value: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' }, { value: 'normal', label: 'Normal', description: 'Balanced, few issues' }, { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated' } ] },
      { step: 2, key: 'concerns', question: "What are your main skin concerns?", icon: <Target className="h-8 w-8 text-pink-500" />, options: [ { value: 'acne', label: 'Acne & Breakouts' }, { value: 'aging', label: 'Fine Lines & Wrinkles' }, { value: 'pigmentation', label: 'Dark Spots & Pigmentation' }, { value: 'pores', label: 'Large Pores' }, { value: 'dullness', label: 'Dullness & Uneven Tone' }, { value: 'sensitivity', label: 'Redness & Sensitivity' } ], multiple: true },
      { step: 3, key: 'age', question: "What's your age range?", icon: <User className="h-8 w-8 text-purple-500" />, options: [ { value: '18-24', label: '18-24 years' }, { value: '25-34', label: '25-34 years' }, { value: '35-44', label: '35-44 years' }, { value: '45+', label: '45+ years' } ] },
      { step: 4, key: 'routine', question: "How would you describe your current skincare routine?", icon: <Star className="h-8 w-8 text-green-500" />, options: [ { value: 'none', label: 'No routine', description: 'I just wash my face' }, { value: 'basic', label: 'Basic', description: '2-3 products daily' }, { value: 'moderate', label: 'Moderate', description: '4-6 products, AM/PM routine' }, { value: 'extensive', label: 'Extensive', description: '7+ products, multi-step' } ] },
      { step: 5, key: 'environment', question: "What's your environment like?", icon: <Sun className="h-8 w-8 text-orange-500" />, options: [ { value: 'humid', label: 'Hot & Humid', description: 'Coastal areas' }, { value: 'dry', label: 'Hot & Dry', description: 'North/Central India' }, { value: 'pollution', label: 'High Pollution', description: 'Metro cities' }, { value: 'moderate', label: 'Moderate Climate', description: 'Balanced weather' } ] }
    ];

    const currentQuestionData = questions[currentQuestionStep - 1];

    const handleAnswer = (value) => {
      if (currentQuestionData.multiple) {
        const newConcerns = questionnaire.concerns.includes(value)
          ? questionnaire.concerns.filter(c => c !== value)
          : [...questionnaire.concerns, value];
        setQuestionnaire({ ...questionnaire, concerns: newConcerns });
      } else {
        setQuestionnaire({ ...questionnaire, [currentQuestionData.key]: value });
      }
    };

    const handleNext = () => {
      if (currentQuestionStep < questions.length) {
        setCurrentQuestionStep(currentQuestionStep + 1);
      } else {
        setCurrentStep('email-capture');
      }
    };

    const handleBack = () => {
      if (currentQuestionStep > 1) {
        setCurrentQuestionStep(currentQuestionStep - 1);
      } else {
        setCurrentStep('welcome'); // Go back to welcome page from the first question
      }
    };

    const isAnswered = () => {
      if (currentQuestionData.multiple) {
        return questionnaire.concerns.length > 0;
      }
      return questionnaire[currentQuestionData.key] !== '';
    };

    if (!currentQuestionData) return null; // Should not happen if logic is correct

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full"> {/* Changed max-w-md to max-w-2xl for more space */}
          <ProgressBar current={currentQuestionStep + 2} total={TOTAL_PRE_ANALYSIS_STEPS} /> {/* Q1 is step 3 (1+2), Q5 is step 7 (5+2) */}
          
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-pink-100 p-4 rounded-full inline-block mb-4">
              {currentQuestionData.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestionData.question}
            </h2>
            {currentQuestionData.multiple && (
              <p className="text-sm text-gray-600">Select all that apply</p>
            )}
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestionData.options.map((option) => {
              const isSelected = currentQuestionData.multiple 
                ? questionnaire.concerns.includes(option.value)
                : questionnaire[currentQuestionData.key] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${ // Added text-left
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      {option.description && (
                        <p className="text-sm text-gray-600">{option.description}</p>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 ml-2" /> // Added ml-2
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                isAnswered()
                  ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestionStep === questions.length ? 'Continue to Email' : 'Continue'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const EmailCapturePage = () => {
    const [emailInput, setEmailInput] = useState(userEmail || ''); // Local state for input field


    const handleSubmitEmail = async () => {
        if (!emailInput || !/\S+@\S+\.\S+/.test(emailInput)) {
            alert('Please enter a valid email address.');
            return;
        }
        setIsSubmitting(true);
        setUserEmail(emailInput);
        try {
            // Assuming saveEmailSubscriber is async and returns { success: boolean, alreadyExists?: boolean }
            const result = await saveEmailSubscriber(emailInput); 
            if (result.success) {
                console.log(result.alreadyExists ? 'Email already subscribed.' : 'Email subscribed!');
            } else {
                // Handle failure, though we might still proceed
                console.log('Email subscription failed, but continuing...');
            }
        } catch (dbError) {
            console.error('Database save error (email subscription):', dbError);
            // Still proceed even if DB save fails, as per original logic
        }
        setCurrentStep('photos');
        setIsSubmitting(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <ProgressBar current={TOTAL_PRE_ANALYSIS_STEPS - 1} total={TOTAL_PRE_ANALYSIS_STEPS} /> {/* Email is step 8 of 9 */}
          
          <div className="text-center mb-6">
            <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              One Last Step!
            </h2>
            <p className="text-gray-600">
              Enter your email to receive your personalized skin report.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your.email@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              autoComplete="email"
              id="emailField" // Keep id if needed elsewhere, though direct value access is better in React
            />
            
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" defaultChecked className="rounded text-pink-500 focus:ring-pink-400" />
              <span>Send me skincare tips and exclusive discounts</span>
            </label>

            <button
              onClick={handleSubmitEmail}
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold transition-colors bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Continue to Photo Upload'}
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentStep('questionnaire');
              setCurrentQuestionStep(5); // Go back to the last question
            }}
            className="w-full mt-4 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to Questions
          </button>
        </div>
      </div>
    );
  };

  const PhotoUploadPage = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Skin Photos</h2>
          <p className="text-gray-600">We need 4 clear photos for comprehensive analysis</p>
          <div className="mt-6 bg-gray-200 rounded-full h-3 max-w-md mx-auto">
          <div 
            className="bg-gradient-to-r from-pink-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(Object.values(photos).filter(p => p?.uploaded).length / 4) * 100}%` }}
          />
          </div>
          <p className="text-sm text-gray-500 mt-2">
          {Object.values(photos).filter(p => p?.uploaded).length} of 4 photos uploaded
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            { key: 'front', title: 'Front View', desc: 'Face the camera directly with good lighting' },
            { key: 'left', title: 'Left Profile', desc: 'Turn 90° to your left' },
            { key: 'right', title: 'Right Profile', desc: 'Turn 90° to your right' },
            { key: 'closeup', title: 'Close-up Detail', desc: 'Focus on main concern area' }
          ].map(({ key, title, desc }) => (
            <div key={key} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{desc}</p>
              <div className="relative">
                {photos[key]?.preview ? (
                  <div className="relative">
                    <img 
                      src={photos[key].preview} 
                      alt={title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRefs[key].current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                  </div>
                )}
                <input
                  ref={fileInputRefs[key]}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handlePhotoUpload(key, e)}
                  className="hidden"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          {allPhotosUploaded ? (
            <button onClick={analyzePhotos} className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200">
              Analyze My Skin 🔍
            </button>
          ) : (
            <button disabled className="bg-gray-300 text-gray-500 px-12 py-4 rounded-full text-xl font-semibold cursor-not-allowed">
              Upload All Photos to Continue
            </button>
          )}
          <button onClick={() => setCurrentStep('email-capture')} className="block mx-auto mt-4 text-gray-600 hover:text-gray-800 flex items-center justify-center">
            <ChevronLeft className="mr-1 h-5 w-5" /> Back to Email
          </button>
        </div>
      </div>
    </div>
  );

  const AnalyzingPage = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const tips = [
      { icon: "🔬", text: "AI is examining your skin texture and tone..." },
      { icon: "🎯", text: "Identifying your unique skin concerns..." },
      { icon: "📊", text: "Calculating your skin health score..." },
      { icon: "👥", text: "Comparing with 50,000+ Indian users..." },
      { icon: "💡", text: "Generating personalized recommendations..." },
      { icon: "✨", text: "Almost ready with your detailed results!" }
    ];

    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 2000); // Change tips every 2 seconds
      return () => clearInterval(interval);
    }, [tips.length]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-blue-200 rounded-full animate-spin" style={{ animationDelay: "0.2s" }}></div>
              <div className="absolute inset-6 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center">
                <Eye className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Skin...</h2>
            <div className="h-20 flex items-center justify-center">
              <p className="text-lg text-gray-600">{tips[currentTip].icon} {tips[currentTip].text}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-4">Did you know?</p>
            <p className="text-gray-700">
              Indian skin faces unique challenges like pollution, humidity, and intense UV rays. 
              Our AI is specially trained on 50,000+ Indian skin samples! 🇮🇳
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ResultsPage = () => {
    const downloadReport = () => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Your Detailed Skin Analysis Report", 10, 10);
      doc.setFontSize(12);
      doc.text(`Overall Score: ${analysis?.overallScore}`, 10, 20);
      doc.text(`Skin Type: ${analysis?.skinType}`, 10, 30);
      doc.text("Detailed Metrics:", 10, 40);
      Object.entries(analysis?.detailedMetrics || {}).forEach(([key, value], index) => {
        doc.text(`${key}: ${value}%`, 10, 50 + index * 10);
      });
      doc.save("Skin_Analysis_Report.pdf");
    };

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Advanced Skin Analysis is Ready!</h2>
              <div className="flex items-center justify-center space-x-8 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analysis?.overallScore}</div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analysis?.confidenceScore}%</div>
                  <div className="text-sm text-gray-500">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{analysis?.comparisonData?.yourRanking}</div>
                  <div className="text-sm text-gray-500">Percentile</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={downloadReport}
              className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Download My Report
            </button>
            <button
              onClick={generateRoutine}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Get My Personalized Routine
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RoutinePage = () => {
    const downloadRoutine = () => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Your Personalized Skincare Routine", 10, 10);
      doc.setFontSize(12);
      doc.text("Morning Routine:", 10, 20);
      routine?.morning.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.step} - ${item.product}`, 10, 30 + index * 10);
      });
      doc.text("Evening Routine:", 10, 60);
      routine?.evening.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.step} - ${item.product}`, 10, 70 + index * 10);
      });
      doc.save("Personalized_Routine.pdf");
    };

    // Fallback for undefined or empty routines
    if (!routine || (!routine.morning?.length && !routine.evening?.length)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading your personalized routine...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Personalized Skincare Routine</h2>
            <p className="text-gray-600">Curated specifically for Indian skin and climate</p>
          </div>

          {/* Morning Routine */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Morning Routine</h3>
            <div className="space-y-6">
              {routine.morning.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-gray-900">{item.step}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <a
                    href={item.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Buy Now →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Evening Routine</h3>
            <div className="space-y-6">
              {routine.evening.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-gray-900">{item.step}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <a
                    href={item.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Buy Now →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={downloadRoutine}
              className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Download My Routine
            </button>
            <button
              onClick={() => setCurrentStep('consultation')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Book 1-on-1 Consultation
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConsultationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Book 1-on-1 Consultation with Ishika
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get personalized skincare advice from our expert dermatologist with 8+ years of experience treating Indian skin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">What You'll Get:</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Detailed analysis of your skin concerns</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Customized treatment plan</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Product recommendations for Indian climate</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Follow-up support via WhatsApp</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Lifestyle and diet suggestions</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Session Details:</h3>
              <div className="text-left space-y-3 text-gray-700">
                <div className="flex items-center"><Calendar className="h-5 w-5 text-blue-500 mr-2" />45-minute video consultation</div>
                <div className="flex items-center"><MessageCircle className="h-5 w-5 text-blue-500 mr-2" />WhatsApp follow-up included</div>
                <div className="flex items-center"><Award className="h-5 w-5 text-blue-500 mr-2" />Certified dermatologist</div>
                <div className="flex items-center"><Shield className="h-5 w-5 text-blue-500 mr-2" />100% confidential</div>
                <div className="flex items-center"><Star className="h-5 w-5 text-blue-500 mr-2" />4.9/5 rating (500+ consultations)</div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">₹2,499</div>
                <div className="text-sm text-gray-500 line-through mb-1">₹3,999</div>
                <div className="text-sm text-green-600 font-semibold">Limited Time Offer!</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setAppointmentBooked(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:shadow-lg transition-all duration-200 mb-4"
            >
              <Calendar className="inline-block w-6 h-6 mr-2" />
              Book Your Slot Now
            </button>

            <p className="text-sm text-gray-500">
              Secure payment via Cashfree • Cancel up to 24 hours before • 100% satisfaction guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AppointmentConfirmationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center">
        {/* ...AppointmentConfirmationPage JSX... */}
        <div className="space-y-4">
          <button
            onClick={() => {
              setCurrentStep('landing');
              setAppointmentBooked(false);
            }}
            className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Return to Home
          </button>
          <p className="text-sm text-gray-500">
            You'll receive a confirmation email with meeting details shortly.
          </p>
        </div>
      </div>
    </div>
  );

  const SignupModal = () => (
    showSignup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          {/* ...SignupModal JSX... */}
          <div className="flex justify-between mt-4">
            <button onClick={() => setShowSignup(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
            <button className="text-blue-600 hover:text-blue-700">Privacy Policy</button>
          </div>
        </div>
      </div>
    )
  );

  // Main render logic
  if (currentStep === 'landing') return <LandingPage />;
  if (currentStep === 'consent') return <ConsentPage />;
  if (currentStep === 'welcome') return <WelcomePage />;
  if (currentStep === 'questionnaire') return <QuestionnairePage />;
  if (currentStep === 'email-capture') return <EmailCapturePage />;
  if (currentStep === 'photos') return <PhotoUploadPage />;
  if (currentStep === 'analyzing') return <AnalyzingPage />;
  if (currentStep === 'results') return <ResultsPage />;
  if (currentStep === 'routine') return <RoutinePage />;
  if (currentStep === 'consultation') return <ConsultationPage />;
  if (appointmentBooked) return <AppointmentConfirmationPage />;

  return (
    <div>
      <p>Loading or unknown step...</p>
      <SignupModal />
    </div>
  );
};

export default SkincareApp;