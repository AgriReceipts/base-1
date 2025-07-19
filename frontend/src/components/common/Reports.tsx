import {Clock, BarChart3} from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className='flex  justify-center h-full w-full bg-gray-50'>
      <div className='text-center p-8 mt-30'>
        <div className='mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4'>
            <BarChart3 className='w-8 h-8 text-blue-600' />
          </div>
        </div>

        <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
          Reports Coming Soon
        </h1>

        <p className='text-gray-600 mb-6 max-w-md'>
          We're working hard to bring you comprehensive reporting features. Stay
          tuned for updates!
        </p>

        <div className='inline-flex items-center text-sm text-gray-500'>
          <Clock className='w-4 h-4 mr-2' />
          Feature in development
        </div>
      </div>
    </div>
  );
}
