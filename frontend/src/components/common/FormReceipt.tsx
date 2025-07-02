import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import type {CreateReceiptSchema} from '@/types/receipt';
import {format} from 'date-fns';
import {Building2, CalendarIcon, RotateCcw, Save} from 'lucide-react';
import type {z} from 'zod';

// Define props interface for type safety
interface FormReceiptProps {
  formData: Omit<z.infer<typeof CreateReceiptSchema>, 'receiptDate'>;
  onFormChange: (
    field: keyof FormReceiptProps['formData'],
    value: string | number
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  date: Date | undefined;
  onDateChange: (date?: Date) => void;
  isEditing: boolean;
  loading: boolean;
  committeeData: {id: string; name: string; code?: string} | null;
  availableCheckposts: {id: string; name: string}[];
  commodities: {id: string; name: string}[];
  commoditySearch: string;
  setCommoditySearch: (search: string) => void;
}

// Constants for select options
const units = ['quintals', 'numbers', 'bags'];
const natureOfReceipt = [
  {value: 'mf', label: 'Market Fee (MF)'},
  {value: 'lc', label: 'License Fee (LC)'},
  {value: 'uc', label: 'User Charges (UC)'},
  {value: 'others', label: 'Others'},
];
const supervisors = ['SUPERVISOR_1', 'SUPERVISOR_2']; // Mock data

const FormReceipt: React.FC<FormReceiptProps> = ({
  formData,
  onFormChange,
  handleSubmit,
  handleReset,
  date,
  onDateChange,
  isEditing,
  loading,
  committeeData,
  availableCheckposts,
  commodities,
  commoditySearch,
  setCommoditySearch,
}) => {
  const filteredCommodities = commodities.filter((c) =>
    c.name.toLowerCase().includes(commoditySearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Committee Information Card */}
      <div className='p-4 border rounded-lg bg-blue-50 border-blue-200'>
        <div className='flex items-center space-x-3'>
          <Building2 className='h-5 w-5 text-blue-600' />
          <div>
            <h3 className='font-medium text-blue-900'>Committee Information</h3>
            <p className='text-sm text-blue-700'>
              <span className='font-semibold'>
                {committeeData?.name ||
                  'Kakinada Agricultural Market Committee'}
              </span>
              <span className='ml-2'>
                • Code: {committeeData?.code || 'KKD-AMC'}
              </span>
            </p>
            <p className='text-xs text-blue-600 mt-1'>
              Available Checkposts:{' '}
              {availableCheckposts.length > 0
                ? availableCheckposts.map((c) => c.name).join(', ')
                : 'No checkposts (Office collection only)'}
            </p>
          </div>
        </div>
      </div>

      {/* Date and Receipt Info */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label>Receipt Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
                disabled={isEditing}>
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              {!isEditing && (
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bookNumber'>Book Number</Label>
          <Input
            id='bookNumber'
            placeholder='Enter book number'
            value={formData.bookNumber}
            onChange={(e) => onFormChange('bookNumber', e.target.value)}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='receiptNumber'>Receipt Number</Label>
          <Input
            id='receiptNumber'
            placeholder='Enter receipt number'
            value={formData.receiptNumber}
            onChange={(e) => onFormChange('receiptNumber', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Trader/Farmer and Payee Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Trader/Farmer Section */}
        <div className='space-y-4 p-4 border rounded-lg bg-blue-50/50'>
          <h3 className='font-medium text-blue-900'>Trader/Farmer Details</h3>
          <div className='space-y-2'>
            <Label htmlFor='traderName'>Trader/Farmer Name</Label>
            <Input
              id='traderName'
              placeholder='Enter trader/farmer name'
              value={formData.traderName}
              onChange={(e) => onFormChange('traderName', e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='traderAddress'>Trader Address</Label>
            <Input
              id='traderAddress'
              placeholder='Enter trader address'
              value={formData.traderAddress || ''}
              onChange={(e) => onFormChange('traderAddress', e.target.value)}
            />
          </div>
        </div>

        {/* Payee Section */}
        <div className='space-y-4 p-4 border rounded-lg bg-green-50/50'>
          <h3 className='font-medium text-green-900'>Payee Details</h3>
          <div className='space-y-2'>
            <Label htmlFor='payeeName'>Payee Name</Label>
            <Input
              id='payeeName'
              placeholder='Enter payee name'
              value={formData.payeeName}
              onChange={(e) => onFormChange('payeeName', e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='payeeAddress'>Payee Address</Label>
            <Input
              id='payeeAddress'
              placeholder='Enter payee address'
              value={formData.payeeAddress || ''}
              onChange={(e) => onFormChange('payeeAddress', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Commodity and Transaction Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='commodity'>Commodity</Label>
          <Select
            value={formData.commodity}
            onValueChange={(value) => {
              onFormChange('commodity', value);
              if (value !== 'other') {
                onFormChange('newCommodityName', '');
              }
            }}>
            <SelectTrigger>
              <SelectValue placeholder='Select commodity' />
            </SelectTrigger>
            <SelectContent>
              <div className='p-2'>
                <Input
                  placeholder='Search commodity...'
                  value={commoditySearch}
                  onChange={(e) => setCommoditySearch(e.target.value)}
                  className='w-full'
                  onClick={(e) => e.stopPropagation()} // Prevents dropdown from closing
                />
              </div>
              {filteredCommodities.length > 0 ? (
                filteredCommodities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))
              ) : (
                <div className='p-2 text-center text-sm text-muted-foreground'>
                  No commodities found.
                </div>
              )}
              <SelectItem value='other'>Other (Please specify)</SelectItem>
            </SelectContent>
          </Select>
          {formData.commodity === 'other' && (
            <Input
              placeholder='Specify new commodity'
              value={formData.newCommodityName || ''}
              onChange={(e) =>
                onFormChange('newCommodityName', e.target.value)
              }
              className='mt-2'
            />
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='quantity'>Quantity</Label>
          <Input
            id='quantity'
            type='number'
            placeholder='Enter quantity'
            value={formData.quantity}
            onChange={(e) =>
              onFormChange('quantity', parseFloat(e.target.value))
            }
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='unit'>Unit</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => onFormChange('unit', value)}>
            <SelectTrigger>
              <SelectValue placeholder='Select unit' />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='natureOfReceipt'>Nature of Receipt</Label>
          <Select
            value={formData.natureOfReceipt}
            onValueChange={(value) => onFormChange('natureOfReceipt', value)}>
            <SelectTrigger>
              <SelectValue placeholder='Select nature' />
            </SelectTrigger>
            <SelectContent>
              {natureOfReceipt.map((nature) => (
                <SelectItem key={nature.value} value={nature.value}>
                  {nature.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial and Transport Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='value'>Value (₹)</Label>
          <Input
            id='value'
            type='number'
            placeholder='Enter value'
            value={formData.value}
            onChange={(e) => onFormChange('value', parseFloat(e.target.value))}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='feesPaid'>Fees Paid (₹)</Label>
          <Input
            id='feesPaid'
            type='number'
            placeholder='Enter fees paid'
            value={formData.feesPaid}
            onChange={(e) =>
              onFormChange('feesPaid', parseFloat(e.target.value))
            }
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vehicleNumber'>Vehicle Number</Label>
          <Input
            id='vehicleNumber'
            placeholder='Enter vehicle number'
            value={formData.vehicleNumber || ''}
            onChange={(e) => onFormChange('vehicleNumber', e.target.value)}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='invoiceNumber'>Invoice Number</Label>
          <Input
            id='invoiceNumber'
            placeholder='Enter invoice number'
            value={formData.invoiceNumber || ''}
            onChange={(e) => onFormChange('invoiceNumber', e.target.value)}
          />
        </div>
      </div>

      {/* Collection Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='collectionLocation'>Collection Location</Label>
          <Select
            value={formData.collectionLocation}
            onValueChange={(value) =>
              onFormChange('collectionLocation', value)
            }>
            <SelectTrigger>
              <SelectValue placeholder='Select location' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='office'>Office</SelectItem>
              <SelectItem value='checkpost'>Checkpost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.collectionLocation === 'office' && (
          <div className='space-y-2'>
            <Label htmlFor='collectedBy'>Collected By</Label>
            <Select
              value={formData.officeSupervisor || ''}
              onValueChange={(value) =>
                onFormChange('officeSupervisor', value)
              }>
              <SelectTrigger>
                <SelectValue placeholder='Select supervisor' />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor} value={supervisor}>
                    {supervisor.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.collectionLocation === 'checkpost' &&
          availableCheckposts.length > 0 && (
            <div className='space-y-2'>
              <Label htmlFor='checkpostLocation'>Checkpost Location</Label>
              <Select
                value={formData.checkpostId || ''}
                onValueChange={(value) => onFormChange('checkpostId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select checkpost' />
                </SelectTrigger>
                <SelectContent>
                  {availableCheckposts.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
      </div>

      {/* Administrative Details */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='generatedBy'>Generated By</Label>
          <Input
            id='generatedBy'
            placeholder='Enter who generated this receipt'
            value={formData.generatedBy}
            onChange={(e) => onFormChange('generatedBy', e.target.value)}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='designation'>Designation</Label>
          <Input
            id='designation'
            placeholder='Enter designation'
            value={formData.designation}
            onChange={(e) => onFormChange('designation', e.target.value)}
            required
          />
        </div>
      </div>

      <div className='flex gap-4 pt-4'>
        <Button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white'
          disabled={loading}>
          <Save className='mr-2 h-4 w-4' />
          {loading ? 'Saving...' : 'Save Receipt'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={handleReset}
          disabled={loading}>
          <RotateCcw className='mr-2 h-4 w-4' /> Reset Form
        </Button>
      </div>
    </form>
  );
};

export default FormReceipt;
