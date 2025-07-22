import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion, useAnimation} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import logo from '../../assets/logo-ap.png';
import {
  ShieldCheck as ShieldCheckIcon,
  Menu as Bars3Icon,
  X as XMarkIcon,
  FileText as DocumentIcon,
  Eye as EyeIcon,
  Zap as BoltIcon,
  BarChart2 as ChartBarIcon,
  Lock as LockClosedIcon,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';

// Header Component with Collapsing Menu
const Header = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
        controls.start({
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        });
      } else {
        setScrolled(false);
        controls.start({
          backgroundColor: 'rgba(255, 255, 255, 0)',
          boxShadow: 'none',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{y: -60, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.2, ease: 'easeOut'}}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}>
      <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
        <motion.div
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: 0.1}}
          className='flex items-center space-x-3 cursor-pointer'
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <motion.img
            src={logo}
            className={`${
              scrolled ? 'h-8' : 'h-12'
            } transition-all duration-300 w-auto sm:h-10 md:h-12`}
            alt='Agri Receipts Logo'
            whileHover={{scale: 1.08, rotate: 6}}
            transition={{type: 'spring', stiffness: 300}}
          />
          <div>
            <h1
              className={`${
                scrolled ? 'text-lg' : 'text-xl'
              } font-semibold text-gray-800 transition-all duration-300 sm:text-xl md:text-2xl`}>
              Agri Receipts
            </h1>
            {!scrolled && (
              <>
                <p className='text-xs text-gray-500 hidden sm:block'>
                  Digital Receipts for Agricultural Market Committees
                </p>
                <motion.span
                  className='text-xs text-green-600 font-semibold hidden sm:block'
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.5}}>
                  Secure. Transparent. Efficient.
                </motion.span>
              </>
            )}
          </div>
        </motion.div>
        <div className='flex items-center'>
          <motion.div
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            transition={{delay: 0.2}}
            className='hidden md:flex space-x-4'>
            <motion.button
              whileHover={{scale: 1.07}}
              whileTap={{scale: 0.97}}
              onClick={() => navigate('/verifyReceipt')}
              className='px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-md border border-green-200 transition-all hover:shadow-sm'>
              Verify Receipt
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.07,
                boxShadow: '0 4px 16px 0 rgba(16, 185, 129, 0.15)',
              }}
              whileTap={{scale: 0.97}}
              onClick={() => navigate('/login')}
              className='px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-emerald-700 rounded-md shadow-sm transition-all hover:shadow-md'>
              Sign In
            </motion.button>
          </motion.div>
          <button
            className='md:hidden p-2 text-gray-600 hover:text-gray-800'
            onClick={toggleMenu}>
            {isMenuOpen ? (
              <XMarkIcon className='w-6 h-6' />
            ) : (
              <Bars3Icon className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{height: 0, opacity: 0}}
          animate={{height: 'auto', opacity: 1}}
          exit={{height: 0, opacity: 0}}
          transition={{duration: 0.2}}
          className='md:hidden bg-white shadow-lg'>
          <div className='flex flex-col items-center py-4 space-y-4'>
            <button
              onClick={() => {
                navigate('/verifyReceipt');
                setIsMenuOpen(false);
              }}
              className='w-full text-center px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50'>
              Verify Receipt
            </button>
            <button
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              className='w-full text-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-emerald-700'>
              Sign In
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

// Hero Component
const Hero = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className='min-h-[80vh] xl:min-h-[90vh] flex items-center justify-center bg-[#f3fcf6] pt-16 sm:pt-20'>
      <div className='max-w-full xl:max-w-8xl  mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 xl:py-20 2xl:py-24 flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-12 2xl:gap-16'>
        {/* Left: Texts */}
        <div className='w-full lg:w-1/2 xl:w-[48%] flex flex-col items-start text-left'>
          {/* Badge */}
          <div className='mb-3 xl:mb-4'>
            <span className='inline-flex items-center px-4 xl:px-5 py-1.5 xl:py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm xl:text-sm'>
              <span className='mr-2 text-base xl:text-lg'>🌱</span>
              Agricultural Innovation
            </span>
          </div>
          {/* Heading */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold leading-tight mb-4 xl:mb-6'>
            <span className='block text-gray-900'>Empowering</span>
            <span className='block'>
              <span className='text-green-600'>Agricultural</span>
            </span>
            <span className='block text-gray-900'>Market Committees</span>
          </h1>
          {/* Supporting paragraph */}
          <p className='text-lg xl:text-xl 2xl:text-xl text-gray-500 mb-6 xl:mb-8 max-w-2xl xl:max-w-2xl leading-relaxed'>
            Transform your transactions with secure, digital receipts. <br></br>
            Verify authenticity instantly and build trust across the entire
            supply chain.
          </p>
          {/* Primary action button */}
          <div>
            <button
              className='flex items-center gap-2 xl:gap-3 px-7 xl:px-8 py-3 xl:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl xl:rounded-2xl shadow-lg xl:shadow-xl transition-all text-lg xl:text-lg'
              onClick={() => navigate('/verifyReceipt')}>
              <svg
                className='w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 mr-0.5'
                fill='none'
                stroke='white'
                strokeWidth='2'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12l2 2l4-4'
                />
              </svg>
              Verify Receipt
            </button>
          </div>
        </div>
        {/* Right: Animated Image */}
        <motion.div
          className='w-full lg:w-1/2 xl:w-[48%] flex justify-center lg:justify-end items-center mt-8 lg:mt-0 xl:mr-0 max-w-[90%] xl:max-w-full'
          initial={{y: 40, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.2, duration: 0.5}}>
          <motion.div
            className='max-w-md xl:max-w-lg 2xl:max-w-xl w-full rounded-2xl xl:rounded-3xl shadow-2xl xl:shadow-3xl overflow-hidden border border-gray-200'
            animate={{y: [0, -10, 0]}}
            transition={{repeat: Infinity, duration: 6, ease: 'easeInOut'}}>
            <img
              src='/hybrid-rice.jpeg'
              alt='Hybrid rice field'
              className='w-full h-auto'
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature: Add Receipts
const AddReceiptsFeature = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const FeatureSection = ({
    title,
    description,
    visual,
    subPoints,
    reverse,
  }: {
    title: string;
    description: string;
    visual: React.ReactNode;
    subPoints?: string[];
    reverse?: boolean;
  }) => (
    <section className='py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50'>
      <div
        className={`max-w-7xl mx-auto flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } items-center gap-8 sm:gap-12 px-4 sm:px-6 lg:px-8`}>
        <div className='w-full lg:w-1/2 flex justify-center mb-6 lg:mb-0'>
          {visual}
        </div>
        <div className='w-full lg:w-1/2'>
          <h3 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900'>
            {title}
          </h3>
          <p className='text-base sm:text-lg text-gray-600 mb-4'>
            {description}
          </p>
          {subPoints && (
            <ul className='space-y-2 sm:space-y-3 mt-4'>
              {subPoints.map((point, idx) => (
                <li
                  key={idx}
                  className='flex items-start text-gray-700 text-sm sm:text-base'>
                  <CheckCircleIcon className='w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5 mr-2' />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );

  const StaticFormMockup = () => (
    <div className='w-full max-w-xs sm:max-w-sm bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6'>
      <h4 className='text-base sm:text-lg font-semibold mb-4 text-green-700'>
        New Receipt- AMC Kakinada Rural
      </h4>
      <div className='space-y-2 sm:space-y-3'>
        <input
          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          placeholder='Payee Name'
          disabled
        />
        <input
          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          placeholder='Farmer/Trader Name'
          disabled
        />
        <input
          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          placeholder='Commodity'
          disabled
        />
        <input
          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          placeholder='Fees Paid (mf)'
          disabled
        />
        <button
          className='w-full mt-2 py-2 bg-green-500 text-white rounded-md font-semibold cursor-not-allowed opacity-70 text-sm'
          disabled>
          Generate Receipt
        </button>
      </div>
    </div>
  );

  const StaticTableMockup = () => (
    <div className='w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 overflow-x-auto'>
      <h4 className='text-base sm:text-lg font-semibold mb-4 text-green-700'>
        Recent Receipts Updated
      </h4>
      <table className='min-w-full text-xs sm:text-sm text-left'>
        <thead>
          <tr>
            <th className='px-2 py-1 font-semibold text-gray-700'>
              Book/Receipt Number
            </th>
            <th className='px-2 py-1 font-semibold text-gray-700'>
              Payee Details
            </th>
            <th className='px-2 py-1 font-semibold text-gray-700'>
              Commodity Details
            </th>
            <th className='px-2 py-1 font-semibold text-gray-700'>
              Nature of Receipt
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='px-2 py-1'>05-2502</td>
            <td className='px-2 py-1'>Sai Farms</td>
            <td className='px-2 py-1'>Wheat</td>
            <td className='px-2 py-1 text-green-600 font-semibold'>
              Market Fees
            </td>
          </tr>
          <tr>
            <td className='px-2 py-1'>06-1405</td>
            <td className='px-2 py-1'>Sri Valley</td>
            <td className='px-2 py-1'>Cattle</td>
            <td className='px-2 py-1 text-yellow-600 font-semibold'>
              User Charges
            </td>
          </tr>
          <tr>
            <td className='px-2 py-1'>RCPT-003</td>
            <td className='px-2 py-1'>Riverbend</td>
            <td className='px-2 py-1'>Rice</td>
            <td className='px-2 py-1 text-green-600 font-semibold'>
              Market Fees
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <section
      ref={ref}
      className='min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 py-12 sm:py-16'
      id='add-receipts'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7}}
          className='mb-8 text-center'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4'>
            <span className='block text-gray-900'>Comprehensive</span>
            <span className='block text-green-600'>Feature Set</span>
          </h2>
          <p className='text-base sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto'>
            Explore the powerful features that make Agri Receipts indispensable
            for AMC's.
          </p>
          <div className='flex justify-center mt-4'>
            <span className='block w-16 sm:w-24 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500'></span>
          </div>
        </motion.div>
        <FeatureSection
          title='Create Receipts'
          description='Easily create digital receipts for every trade. No more paperwork, just a few clicks.'
          visual={<StaticFormMockup />}
          subPoints={[
            'Instantly digitize any trade transaction',
            'Reduce manual errors and paperwork',
            'Secure, tamper-proof digital records',
          ]}
        />
        <FeatureSection
          title='View & Manage All Trade Receipts'
          description='Access, filter, and organize all your trade receipts in one place.'
          visual={<StaticTableMockup />}
          reverse
          subPoints={[
            'Search and filter by payee, commodity, or nature of receipt',
            'Export receipts for reporting or auditing',
            'Quickly find any receipt, anytime',
          ]}
        />
      </div>
    </section>
  );
};

// Why Agri Receipts? Section
const ImpactSection = () => {
  const controls = useAnimation();
  const [, inView] = useInView({threshold: 0.1});

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <section className='bg-white py-12 sm:py-16' id='impact'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4'>
          <span className='block text-gray-900'>Why</span>
          <span className='block text-green-600'>Agri Receipts?</span>
        </h2>
        <p className='text-base sm:text-lg text-gray-600 mb-8 sm:mb-12'>
          Discover how Agri Receipts transforms agricultural transactions for
          everyone involved.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full'>
          <div className='p-4 sm:p-6 bg-green-50 rounded-xl shadow flex flex-col items-center'>
            <DocumentIcon className='w-8 sm:w-10 h-8 sm:h-10 text-green-500 mb-4' />
            <h3 className='font-semibold text-base sm:text-lg mb-2'>
              Eliminating Paperwork
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Go digital and say goodbye to lost or damaged receipts.
            </p>
          </div>
          <div className='p-4 sm:p-6 bg-green-50 rounded-xl shadow flex flex-col items-center'>
            <EyeIcon className='w-8 sm:w-10 h-8 sm:h-10 text-green-500 mb-4' />
            <h3 className='font-semibold text-base sm:text-lg mb-2'>
              Boosting Transparency
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Every transaction is recorded and verifiable, building trust.
            </p>
          </div>
          <div className='p-4 sm:p-6 bg-green-50 rounded-xl shadow flex flex-col items-center'>
            <BoltIcon className='w-8 sm:w-10 h-8 sm:h-10 text-green-500 mb-4' />
            <h3 className='font-semibold text-base sm:text-lg mb-2'>
              Enhancing Efficiency
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Save time with instant digital receipts and streamlined workflows.
            </p>
          </div>
          <div className='p-4 sm:p-6 bg-green-50 rounded-xl shadow flex flex-col items-center'>
            <ChartBarIcon className='w-8 sm:w-10 h-8 sm:h-10 text-green-500 mb-4' />
            <h3 className='font-semibold text-base sm:text-lg mb-2'>
              Easy Report Generation
            </h3>
            <p className='text-gray-600 text-sm sm:text-base'>
              Generate detailed reports for better decision-making.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Card features for the features section
const cardFeatures: {
  title: string;
  description: string;
  icon: React.ReactNode;
  subPoints: string[];
}[] = [
  {
    title: 'Verify Genuinity of Trade Receipts',
    description:
      'Instantly check if a receipt is genuine. Detect fakes and ensure transparency.',
    icon: (
      <ShieldCheckIcon className='w-10 sm:w-12 h-10 sm:h-12 text-green-500 mb-4' />
    ),
    subPoints: [
      'One-click verification for any receipt',
      'Detect and prevent fraudulent trades',
      'Build trust with transparent records',
    ],
  },
  {
    title: 'Insightful Understanding for Committee Officers',
    description:
      'Get actionable insights and overviews tailored for committee-level officers.',
    icon: (
      <ChartBarIcon className='w-10 sm:w-12 h-10 sm:h-12 text-green-500 mb-4' />
    ),
    subPoints: [
      'Visual dashboards for quick analysis',
      'Monitor committee performance at a glance',
      'Identify areas for improvement easily',
    ],
  },
  {
    title: 'Set & Track Targets',
    description:
      'Set, manage, and monitor targets. Track committee progress seamlessly.',
    icon: (
      <BoltIcon className='w-10 sm:w-12 h-10 sm:h-12 text-yellow-500 mb-4' />
    ),
    subPoints: [
      'Define and update targets anytime',
      'Visualize progress with intuitive charts',
      'Stay on top of committee goals',
    ],
  },
  {
    title: 'Easy Reports',
    description: 'Generate and export detailed reports with a single click.',
    icon: (
      <DocumentIcon className='w-10 sm:w-12 h-10 sm:h-12 text-purple-500 mb-4' />
    ),
    subPoints: [
      'Export data for compliance or review',
      'Customizable report formats',
      'Get insights and committe progress easily',
    ],
  },
  {
    title: 'Understand Trader Trends',
    description:
      'Analyze trading patterns and trends for smarter decision-making.',
    icon: <EyeIcon className='w-10 sm:w-12 h-10 sm:h-12 text-pink-500 mb-4' />,
    subPoints: [
      'Spot emerging trends among traders',
      'Make data-driven decisions',
      'Adapt strategies based on real insights',
    ],
  },
  {
    title: 'Role-Based Access & Security',
    description:
      'Keep your data safe and workflows efficient with robust, role-based access controls.',
    icon: (
      <LockClosedIcon className='w-10 sm:w-12 h-10 sm:h-12 text-cyan-500 mb-4' />
    ),
    subPoints: [
      'Granular permissions for every user type',
      'Secure authentication for all actions',
      'Peace of mind for AMC committees',
    ],
  },
];

// Committees array for the committees section
const committees: string[] = [
  'Karapa',
  'Kakinada Rural',
  'Pithapuram',
  'Tuni',
  'Prathipadu',
  'Jaggampeta',
  'Peddapuram',
  'Samalkota',
  'Kakinada',
];

// Main Component
const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const [section, ref] of Object.entries(sectionRefs.current)) {
        if (
          ref &&
          ref.offsetTop <= scrollPosition &&
          ref.offsetTop + ref.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const registerRef = (section: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[section] = ref;
    }
  };

  return (
    <div className='bg-white'>
      <Header />
      <div className='fixed right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-40 hidden sm:block'>
        <div className='flex flex-col space-y-2 sm:space-y-3'>
          {[
            'hero',
            'impact',
            'add-receipts',
            'features',
            'committees',
            'footer',
          ].map((section) => (
            <button
              key={section}
              onClick={() => {
                const ref = sectionRefs.current[section];
                if (ref) {
                  window.scrollTo({
                    top: ref.offsetTop - 80,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all ${
                activeSection === section
                  ? 'bg-green-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${section} section`}
            />
          ))}
        </div>
      </div>
      <div ref={(ref) => registerRef('hero', ref)}>
        <Hero />
      </div>
      <div ref={(ref) => registerRef('impact', ref)}>
        <ImpactSection />
      </div>
      <div ref={(ref) => registerRef('add-receipts', ref)}>
        <AddReceiptsFeature />
      </div>
      <div ref={(ref) => registerRef('features', ref)}>
        <div className='py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-12 lg:pr-20'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8'>
              {cardFeatures.map((feature, _) => (
                <motion.div
                  key={feature.title}
                  className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl'
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  }}
                  whileTap={{scale: 0.98}}>
                  <motion.div
                    className='mb-4'
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}>
                    {feature.icon}
                  </motion.div>
                  <h3 className='text-lg sm:text-xl font-bold mb-2 text-center'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 text-center mb-4 text-sm sm:text-base'>
                    {feature.description}
                  </p>
                  <ul className='space-y-2'>
                    {feature.subPoints.map((point, i) => (
                      <li
                        key={i}
                        className='flex items-center text-gray-700 text-sm sm:text-base'>
                        <CheckCircleIcon className='w-4 sm:w-5 h-4 sm:h-5 text-green-500 mr-2' />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div ref={(ref) => registerRef('committees', ref)}>
        <div className='relative py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-12 lg:pr-20'>
            <div className='text-center mb-12 sm:mb-16'>
              <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4'>
                <span className='block text-gray-900'>Connected</span>
                <span className='block text-green-600'>Market Ecosystem</span>
              </h2>
              <p className='text-base sm:text-lg text-gray-600'>
                Unified platform serving all Agricultural Market Committees
                across East Godavari District
              </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
              {committees.map((committee, index) => (
                <motion.div
                  key={index}
                  className='group relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50'
                  initial={{y: 50, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: index * 0.1}}>
                  <motion.div
                    className='w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}>
                    <span className='text-white text-base sm:text-lg font-bold'>
                      {committee[0]}
                    </span>
                  </motion.div>
                  <div className='text-center'>
                    <span className='block text-gray-800 font-semibold text-sm sm:text-lg'>
                      {committee}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div ref={(ref) => registerRef('footer', ref)}>
        <footer className='bg-gradient-to-br from-green-900 to-emerald-900 text-gray-100 pt-14 pb-3 border-t-2 border-green-800 shadow-inner'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start gap-10'>
            {/* Left: Navigation */}
            <div className='w-full md:w-1/4 flex flex-col items-start mb-8 md:mb-0'>
              <div className='flex items-center gap-2 mb-4'>
                <svg
                  className='w-6 h-6 text-green-300'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 7h18M3 12h18M3 17h18'
                  />
                </svg>
                <span className='text-xl font-bold text-white tracking-wide'>
                  Navigation
                </span>
              </div>
              <nav>
                <ul className='space-y-2 mt-2'>
                  <li>
                    <a
                      href='#hero'
                      className='text-gray-300 hover:text-green-300 text-sm transition'>
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href='#impact'
                      className='text-gray-300 hover:text-green-300 text-sm transition'>
                      Why Agri Receipts
                    </a>
                  </li>
                  <li>
                    <a
                      href='#add-receipts'
                      className='text-gray-300 hover:text-green-300 text-sm transition'>
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href='#committees'
                      className='text-gray-300 hover:text-green-300 text-sm transition'>
                      Committees
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            {/* Center: Contributors */}
            <div className='w-full md:w-2/4 flex flex-col items-center'>
              <div className='flex items-center gap-2 mb-6'>
                <svg
                  className='w-6 h-6 text-yellow-300'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                <h3 className='text-xl font-bold tracking-wider text-white'>
                  Contributors
                </h3>
              </div>
              <div className='flex flex-col sm:flex-row gap-6 w-full justify-center'>
                {/* Contributor 1 */}
                <div className='flex-1 max-w-xs bg-white/10 rounded-2xl shadow-lg border border-emerald-300 flex flex-col items-center px-6 py-6 mx-auto'>
                  <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full shadow mb-3 text-2xl font-bold text-gray-700'>
                    S
                  </div>
                  <span className='text-lg text-white font-semibold mb-1'>
                    Srivathsa
                  </span>
                  <span className='text-xs text-gray-300 mb-2'>
                    Lead Developer
                  </span>
                  <div className='flex gap-3 mb-2'>
                    <a
                      href='https://www.linkedin.com/in/srivathsa252/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-blue-200 hover:text-blue-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z' />
                      </svg>
                    </a>
                    <a
                      href='https://github.com/srivathsa252'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-gray-200 hover:text-white'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.698.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z' />
                      </svg>
                    </a>
                  </div>
                </div>
                {/* Contributor 2 */}
                <div className='flex-1 max-w-xs bg-white/10 rounded-2xl shadow-lg border border-emerald-300 flex flex-col items-center px-6 py-6 mx-auto'>
                  <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full shadow mb-3 text-2xl font-bold text-gray-700'>
                    A
                  </div>
                  <span className='text-lg text-white font-semibold mb-1'>
                    Ajay
                  </span>
                  <span className='text-xs text-gray-300 mb-2'>
                    Full Stack Developer
                  </span>
                  <div className='flex gap-3 mb-2'>
                    <a
                      href='https://www.linkedin.com/in/ajay-chandra-01565a24a/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-blue-200 hover:text-blue-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z' />
                      </svg>
                    </a>
                    <a
                      href='https://github.com/ajay-v11'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-gray-200 hover:text-white'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.698.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z' />
                      </svg>
                    </a>
                  </div>
                </div>
                {/* Contributor 3 */}
                <div className='flex-1 max-w-xs bg-white/10 rounded-2xl shadow-lg border border-emerald-300 flex flex-col items-center px-6 py-6 mx-auto'>
                  <div className='bg-gray-200 w-16 h-16 flex items-center justify-center rounded-full shadow mb-3 text-2xl font-bold text-gray-700'>
                    S
                  </div>
                  <span className='text-lg text-white font-semibold mb-1'>
                    Sasi Kumar
                  </span>
                  <span className='text-xs text-gray-300 mb-2'>
                    Full Stack Developer
                  </span>
                  <div className='flex gap-3 mb-2'>
                    <a
                      href='https://www.linkedin.com/in/sasi-kumar-kolli-6596b9259/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-blue-200 hover:text-blue-400'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z' />
                      </svg>
                    </a>
                    <a
                      href='https://github.com/sasikumar272004e'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:scale-110 transition'>
                      <svg
                        className='w-5 h-5 text-gray-200 hover:text-white'
                        fill='currentColor'
                        viewBox='0 0 24 24'>
                        <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.698.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z' />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Contact Us */}
            <div className='w-full md:w-1/4 flex flex-col items-center md:items-end justify-center mt-8 md:mt-0 pr-0 md:pr-12 lg:pr-16'>
              <div className='flex flex-col justify-center h-full w-full md:items-end items-center'>
                <div className='flex items-center gap-2 mb-2'>
                  <svg
                    className='w-6 h-6 text-green-400'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0l-9 6l-9-6'
                    />
                  </svg>
                  <h3 className='text-xl md:text-2xl font-bold text-white text-right'>
                    Contact Us
                  </h3>
                </div>
                <div className='w-8 h-1 bg-green-500 rounded mb-4 self-end md:self-end'></div>
                <p className='text-sm text-gray-200 mb-4 max-w-xs text-center md:text-right'>
                  For any suggestions, feel free to reach out to us via email.
                </p>
                <a
                  href='mailto:agrireceipts@gmail.com'
                  className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all w-full max-w-md mb-3 justify-center text-center'
                  aria-label='Send us an email'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'>
                    <path d='M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0l-9 6l-9-6' />
                  </svg>
                  Send Email
                </a>
                <div className='flex items-center gap-2 w-full justify-center'>
                  <button
                    className='block text-sm font-semibold text-gray-200 break-all text-center px-4 py-1 w-full max-w-md mx-auto bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-center'
                    style={{cursor: 'pointer'}}
                    aria-label='Copy email address'
                    onClick={() => {
                      navigator.clipboard.writeText('agrireceipts@gmail.com');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}>
                    agrireceipts@gmail.com
                  </button>
                  {copied && <span className='text-green-400 text-lg'>✔</span>}
                </div>
              </div>
            </div>
          </div>
          {/* Copyright line at the very bottom */}
          <div className='w-full pt-6 mt-8 border-t border-green-800 text-center text-xs text-gray-400 tracking-wide'>
            © {new Date().getFullYear()} Agri Receipts. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
