import UsersTable from './UserTable';
import Usermanage from './Usermanage';

function UserPage() {
  return (
    <div className='flex flex-col items-center mx-auto w-full'>
      <Usermanage />
      <UsersTable />
    </div>
  );
}

export default UserPage;
