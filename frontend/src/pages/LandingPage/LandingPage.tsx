import {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion, useAnimation} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import logo from '../../assets/logo-ap.png';

type Receipt = {
  id: string;
  date: string;
  amount: number;
  buyer: string;
  seller: string;
  commodity: string;
  status: 'verified' | 'pending' | 'rejected';
};

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <motion.header
      initial={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
      animate={controls}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
        <motion.div
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: 0.2}}
          className='flex items-center space-x-3 cursor-pointer'
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img
            src={logo}
            className={`${
              scrolled ? 'h-8' : 'h-10'
            } transition-all duration-300 w-auto`}
            alt='AgriLedger'
          />
          <div>
            <h1
              className={`${
                scrolled ? 'text-lg' : 'text-xl'
              } font-semibold text-gray-800 transition-all duration-300`}>
              AgriLedger
            </h1>
            {!scrolled && (
              <p className='text-xs text-gray-500'>Market Receipt Management</p>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{opacity: 0, x: 20}}
          animate={{opacity: 1, x: 0}}
          transition={{delay: 0.3}}
          className='flex space-x-4'>
          <button
            onClick={() => navigate('/verifyReceipt')}
            className='px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 transition-all hover:shadow-sm'>
            Verify Receipt
          </button>
          <button
            onClick={() => navigate('/login')}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm transition-all hover:shadow-md'>
            Sign In
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};

// Hero Component
const Hero = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 50},
  };

  return (
    <section
      ref={ref}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 pt-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center'>
        <motion.div
          initial='hidden'
          animate={controls}
          variants={variants}
          transition={{duration: 0.6}}>
          <motion.h1
            className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'
            variants={variants}>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>
              Digital Agricultural Receipts
            </span>
          </motion.h1>
          <motion.p
            className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10'
            variants={variants}
            transition={{delay: 0.2}}>
            Transform your agricultural transactions with blockchain-verified
            digital receipts and advanced analytics.
          </motion.p>
          <motion.div
            className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'
            variants={variants}
            transition={{delay: 0.4}}>
            <button className='px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105'>
              Get Started
            </button>
            <button className='px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105'>
              Live Demo
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, scale: 0.8}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.6, duration: 0.5}}
          className='mt-20 mx-auto max-w-4xl'>
          <div className='relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200'>
            <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'></div>
            <img
              src='https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
              alt='Farmers using AgriLedger'
              className='w-full h-auto'
            />
          </div>
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

  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 50},
  };

  const receiptFormVariants = {
    hidden: {opacity: 0, x: -50},
    visible: {opacity: 1, x: 0},
  };

  return (
    <section
      ref={ref}
      className='min-h-screen flex items-center justify-center bg-white py-20'
      id='add-receipts'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial='hidden'
          animate={controls}
          variants={variants}
          transition={{duration: 0.6}}
          className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <motion.h2
              className='text-4xl font-bold text-gray-900 mb-6'
              variants={variants}>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500'>
                Effortless Receipt Creation
              </span>
            </motion.h2>
            <motion.p
              className='text-xl text-gray-600 mb-8'
              variants={variants}
              transition={{delay: 0.2}}>
              Convert paper transactions to secure digital receipts in seconds
              with our intuitive interface.
            </motion.p>

            <motion.ul
              className='space-y-4'
              variants={variants}
              transition={{delay: 0.4}}>
              <li className='flex items-start'>
                <div className='flex-shrink-0 bg-green-100 p-2 rounded-full'>
                  <svg
                    className='h-5 w-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <p className='ml-3 text-gray-700'>
                  Scan or manually enter receipt details
                </p>
              </li>
              <li className='flex items-start'>
                <div className='flex-shrink-0 bg-green-100 p-2 rounded-full'>
                  <svg
                    className='h-5 w-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <p className='ml-3 text-gray-700'>AI-powered data extraction</p>
              </li>
              <li className='flex items-start'>
                <div className='flex-shrink-0 bg-green-100 p-2 rounded-full'>
                  <svg
                    className='h-5 w-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <p className='ml-3 text-gray-700'>
                  Blockchain-verified digital records
                </p>
              </li>
              <li className='flex items-start'>
                <div className='flex-shrink-0 bg-green-100 p-2 rounded-full'>
                  <svg
                    className='h-5 w-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <p className='ml-3 text-gray-700'>
                  Instant sharing with counterparties
                </p>
              </li>
            </motion.ul>
          </div>

          <motion.div
            variants={receiptFormVariants}
            transition={{delay: 0.6}}
            className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl opacity-20 blur-lg'></div>
            <div className='relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200'>
              <div className='bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white'>
                <h3 className='text-lg font-semibold'>New Digital Receipt</h3>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Transaction Date
                    </label>
                    <div className='relative'>
                      <input
                        type='date'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Buyer
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        placeholder='Buyer name'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Seller
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        placeholder='Seller name'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Commodity
                    </label>
                    <select className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'>
                      <option>Wheat</option>
                      <option>Corn</option>
                      <option>Soybeans</option>
                      <option>Rice</option>
                      <option>Coffee</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Amount (kg)
                    </label>
                    <input
                      type='number'
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='1000'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Price per kg
                    </label>
                    <input
                      type='number'
                      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='0.50'
                    />
                  </div>

                  <div className='pt-4'>
                    <button className='w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-md hover:from-green-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg'>
                      Generate Digital Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature: View Receipts
const ViewReceiptsFeature = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>(
    'all'
  );

  // Sample receipt data
  const receipts: Receipt[] = [
    {
      id: 'RCPT-2023-001',
      date: '2023-06-15',
      amount: 1500,
      buyer: 'Global Grains Inc.',
      seller: 'Sunshine Farms',
      commodity: 'Wheat',
      status: 'verified',
    },
    {
      id: 'RCPT-2023-002',
      date: '2023-06-16',
      amount: 800,
      buyer: 'Organic Markets',
      seller: 'Green Valley',
      commodity: 'Corn',
      status: 'verified',
    },
    {
      id: 'RCPT-2023-003',
      date: '2023-06-17',
      amount: 1200,
      buyer: 'Premium Foods',
      seller: 'Riverbend Farms',
      commodity: 'Soybeans',
      status: 'pending',
    },
    {
      id: 'RCPT-2023-004',
      date: '2023-06-18',
      amount: 950,
      buyer: 'Export Partners',
      seller: 'Mountain View',
      commodity: 'Rice',
      status: 'verified',
    },
    {
      id: 'RCPT-2023-005',
      date: '2023-06-19',
      amount: 600,
      buyer: 'Local Co-op',
      seller: 'Heritage Farms',
      commodity: 'Coffee',
      status: 'pending',
    },
  ];

  const filteredReceipts = receipts.filter(
    (receipt) => activeTab === 'all' || receipt.status === activeTab
  );

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 50},
  };

  const receiptCardVariants = {
    hidden: {opacity: 0, x: 50},
    visible: {opacity: 1, x: 0},
  };

  return (
    <section
      ref={ref}
      className='min-h-screen flex items-center justify-center bg-gray-50 py-20'
      id='view-receipts'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial='hidden'
          animate={controls}
          variants={variants}
          transition={{duration: 0.6}}
          className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <motion.div
            variants={receiptCardVariants}
            transition={{delay: 0.6}}
            className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-20 blur-lg'></div>
            <div className='relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200'>
              <div className='bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white'>
                <h3 className='text-lg font-semibold'>Receipt Details</h3>
              </div>
              <div className='p-6'>
                <div className='space-y-6'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='text-sm text-gray-500'>Receipt ID</p>
                      <p className='font-medium'>RCPT-2023-001</p>
                    </div>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                      Verified
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Buyer</p>
                      <p className='font-medium'>Global Grains Inc.</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Seller</p>
                      <p className='font-medium'>Sunshine Farms</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Date</p>
                      <p className='font-medium'>Jun 15, 2023</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Commodity</p>
                      <p className='font-medium'>Wheat</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Amount</p>
                      <p className='font-medium'>1,500 kg</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-500'>Price per kg</p>
                      <p className='font-medium'>$0.48</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Total Value</p>
                      <p className='font-medium'>$720.00</p>
                    </div>
                  </div>

                  <div className='pt-2'>
                    <p className='text-sm text-gray-500'>
                      Blockchain Verification
                    </p>
                    <div className='mt-2 flex items-center'>
                      <svg
                        className='h-5 w-5 text-green-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      <span className='ml-2 text-sm text-gray-700'>
                        Verified on AgriChain (Tx: 0x8a3...f4c2)
                      </span>
                    </div>
                  </div>

                  <div className='pt-4 flex space-x-3'>
                    <button className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all'>
                      Share
                    </button>
                    <button className='flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-all'>
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.h2
              className='text-4xl font-bold text-gray-900 mb-6'
              variants={variants}>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'>
                Comprehensive Receipt Management
              </span>
            </motion.h2>
            <motion.p
              className='text-xl text-gray-600 mb-8'
              variants={variants}
              transition={{delay: 0.2}}>
              Access, filter, and manage all your agricultural receipts in one
              secure dashboard.
            </motion.p>

            <motion.div
              className='mb-8'
              variants={variants}
              transition={{delay: 0.4}}>
              <div className='flex border-b border-gray-200'>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  All Receipts
                </button>
                <button
                  onClick={() => setActiveTab('verified')}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'verified'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  Verified
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  Pending
                </button>
              </div>
            </motion.div>

            <motion.div
              className='space-y-4 max-h-96 overflow-y-auto pr-2'
              variants={variants}
              transition={{delay: 0.6}}>
              {filteredReceipts.map((receipt, index) => (
                <motion.div
                  key={receipt.id}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.1 * index}}
                  className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>{receipt.id}</p>
                      <p className='text-sm text-gray-500'>
                        {receipt.commodity} • {receipt.amount} kg
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        receipt.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : receipt.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {receipt.status.charAt(0).toUpperCase() +
                        receipt.status.slice(1)}
                    </span>
                  </div>
                  <div className='mt-2 flex justify-between text-sm'>
                    <p className='text-gray-500'>{receipt.date}</p>
                    <p className='font-medium'>
                      ${(receipt.amount * 0.5).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Feature: Reports
const ReportsFeature = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});
  const [activeReport, setActiveReport] = useState<
    'sales' | 'purchases' | 'inventory'
  >('sales');

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 50},
  };

  const chartVariants = {
    hidden: {opacity: 0, x: -50},
    visible: {opacity: 1, x: 0},
  };

  // Sample data for charts
  const salesData = [
    {month: 'Jan', value: 12000},
    {month: 'Feb', value: 19000},
    {month: 'Mar', value: 15000},
    {month: 'Apr', value: 22000},
    {month: 'May', value: 18000},
    {month: 'Jun', value: 25000},
  ];

  const purchasesData = [
    {month: 'Jan', value: 8000},
    {month: 'Feb', value: 12000},
    {month: 'Mar', value: 10000},
    {month: 'Apr', value: 15000},
    {month: 'May', value: 11000},
    {month: 'Jun', value: 18000},
  ];

  const inventoryData = [
    {commodity: 'Wheat', amount: 15000},
    {commodity: 'Corn', amount: 8000},
    {commodity: 'Soybeans', amount: 12000},
    {commodity: 'Rice', amount: 6000},
    {commodity: 'Coffee', amount: 3000},
  ];

  const currentData =
    activeReport === 'sales'
      ? salesData
      : activeReport === 'purchases'
      ? purchasesData
      : inventoryData;

  return (
    <section
      ref={ref}
      className='min-h-screen flex items-center justify-center bg-white py-20'
      id='reports'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial='hidden'
          animate={controls}
          variants={variants}
          transition={{duration: 0.6}}
          className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <motion.h2
              className='text-4xl font-bold text-gray-900 mb-6'
              variants={variants}>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500'>
                Powerful Reporting Tools
              </span>
            </motion.h2>
            <motion.p
              className='text-xl text-gray-600 mb-8'
              variants={variants}
              transition={{delay: 0.2}}>
              Generate comprehensive reports and gain valuable insights into
              your agricultural transactions.
            </motion.p>

            <motion.div
              className='space-y-6'
              variants={variants}
              transition={{delay: 0.4}}>
              <div
                className={`p-5 rounded-xl cursor-pointer transition-all ${
                  activeReport === 'sales'
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveReport('sales')}>
                <div className='flex items-center'>
                  <div
                    className={`p-3 rounded-lg ${
                      activeReport === 'sales'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                      />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <h3 className='font-medium text-gray-900'>Sales Reports</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                      Track your sales performance over time
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl cursor-pointer transition-all ${
                  activeReport === 'purchases'
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveReport('purchases')}>
                <div className='flex items-center'>
                  <div
                    className={`p-3 rounded-lg ${
                      activeReport === 'purchases'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <h3 className='font-medium text-gray-900'>
                      Purchases Reports
                    </h3>
                    <p className='text-sm text-gray-500 mt-1'>
                      Analyze your procurement patterns
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl cursor-pointer transition-all ${
                  activeReport === 'inventory'
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveReport('inventory')}>
                <div className='flex items-center'>
                  <div
                    className={`p-3 rounded-lg ${
                      activeReport === 'inventory'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                      />
                    </svg>
                  </div>
                  <div className='ml-4'>
                    <h3 className='font-medium text-gray-900'>
                      Inventory Reports
                    </h3>
                    <p className='text-sm text-gray-500 mt-1'>
                      Monitor your commodity stock levels
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={chartVariants}
            transition={{delay: 0.6}}
            className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-20 blur-lg'></div>
            <div className='relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {activeReport === 'sales'
                    ? 'Sales Performance'
                    : activeReport === 'purchases'
                    ? 'Purchases Overview'
                    : 'Inventory Levels'}
                </h3>
                <select className='text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>Last 3 Years</option>
                </select>
              </div>

              <div className='h-80'>
                {/* Chart placeholder - in a real app you would use a charting library like Chart.js */}
                <div className='h-full flex flex-col justify-end'>
                  <div className='flex items-end space-x-2 h-64'>
                    {currentData.map((item, index) => (
                      <div
                        key={index}
                        className='flex-1 flex flex-col items-center'>
                        <div
                          className='w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-sm'
                          style={{
                            height: `${
                              (('value' in item ? item.value : item.amount) /
                                (activeReport === 'inventory'
                                  ? 20000
                                  : 30000)) *
                              100
                            }%`,
                          }}></div>
                        <span className='text-xs text-gray-500 mt-2'>
                          {activeReport === 'inventory' && 'commodity' in item
                            ? item.commodity.substring(0, 3)
                            : 'month' in item
                            ? item.month
                            : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200'>
                <div className='flex justify-between'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Total{' '}
                      {activeReport === 'sales'
                        ? 'Sales'
                        : activeReport === 'purchases'
                        ? 'Purchases'
                        : 'Inventory'}
                    </p>
                    <p className='text-2xl font-semibold'>
                      {activeReport === 'sales'
                        ? '$121,000'
                        : activeReport === 'purchases'
                        ? '$74,000'
                        : '44,000 kg'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>
                      {activeReport === 'sales'
                        ? '12% increase'
                        : activeReport === 'purchases'
                        ? '8% increase'
                        : '5% decrease'}{' '}
                      from last period
                    </p>
                    <p className='text-sm font-medium flex items-center justify-end'>
                      {activeReport !== 'inventory' ? (
                        <span className='text-green-500 flex items-center'>
                          <svg
                            className='h-4 w-4 mr-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M5 10l7-7m0 0l7 7m-7-7v18'
                            />
                          </svg>
                          {activeReport === 'sales' ? '12%' : '8%'}
                        </span>
                      ) : (
                        <span className='text-red-500 flex items-center'>
                          <svg
                            className='h-4 w-4 mr-1'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M19 14l-7 7m0 0l-7-7m7 7V3'
                            />
                          </svg>
                          5%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <button className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all'>
                  Export Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({threshold: 0.1});

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    visible: {opacity: 1, y: 0},
    hidden: {opacity: 0, y: 50},
  };

  return (
    <section
      ref={ref}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 py-20'
      id='cta'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <motion.div
          initial='hidden'
          animate={controls}
          variants={variants}
          transition={{duration: 0.6}}
          className='max-w-3xl mx-auto'>
          <motion.h2
            className='text-4xl md:text-5xl font-bold text-white mb-8'
            variants={variants}>
            Ready to transform your agricultural transactions?
          </motion.h2>
          <motion.p
            className='text-xl text-indigo-200 mb-12'
            variants={variants}
            transition={{delay: 0.2}}>
            Join thousands of farmers, cooperatives, and agribusinesses using
            AgriLedger for secure, verifiable digital receipts.
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'
            variants={variants}
            transition={{delay: 0.4}}>
            <button className='px-8 py-4 bg-white text-indigo-700 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105'>
              Get Started for Free
            </button>
            <button className='px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105'>
              Schedule a Demo
            </button>
          </motion.div>

          <motion.div
            variants={variants}
            transition={{delay: 0.6}}
            className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm'>
              <p className='text-3xl font-bold text-white'>15K+</p>
              <p className='text-indigo-200'>Farmers</p>
            </div>
            <div className='bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm'>
              <p className='text-3xl font-bold text-white'>2M+</p>
              <p className='text-indigo-200'>Receipts</p>
            </div>
            <div className='bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm'>
              <p className='text-3xl font-bold text-white'>$500M+</p>
              <p className='text-indigo-200'>Value</p>
            </div>
            <div className='bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm'>
              <p className='text-3xl font-bold text-white'>24/7</p>
              <p className='text-indigo-200'>Support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component

// Main Component
const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

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

      <div className='fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:block'>
        <div className='flex flex-col space-y-3'>
          {[
            'hero',
            'add-receipts',
            'view-receipts',
            'reports',
            'blockchain',
            'cta',
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
              className={`w-3 h-3 rounded-full transition-all ${
                activeSection === section
                  ? 'bg-blue-600 scale-125'
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

      <div ref={(ref) => registerRef('add-receipts', ref)}>
        <AddReceiptsFeature />
      </div>

      <div ref={(ref) => registerRef('view-receipts', ref)}>
        <ViewReceiptsFeature />
      </div>

      <div ref={(ref) => registerRef('reports', ref)}>
        <ReportsFeature />
      </div>

      <div ref={(ref) => registerRef('cta', ref)}>
        <CTASection />
      </div>
    </div>
  );
};

export default LandingPage;
