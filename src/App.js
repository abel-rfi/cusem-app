import './App.css';

function App() {
  return (
    <div className="agen_login_page">
      <div className='Body'>
      <div className='Header'> 
        <header>BANK LOGO</header>
      </div>
      
      <div className='login_form'>
        <form action="#">
          <div className='error_txt'>Agent not found</div>
          <div className='email_details'>
            <label>Email</label>
            <input type='text' placeholder='Email'></input>
          </div>

          <div className='password_details'>
            <label>Password</label>
            <input type='password' placeholder='password'></input>
          </div>

          <div className='field'>
            <input type='submit' value='Log in'></input>
          </div>

          </form>
      </div>

      <div className='foot_tainer'>
        <div className='footer'> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus. Suspendisse vel ex eget mauris efficitur finibus eu a enim. Aenean tellus neque, consectetur sit amet lacus a, hendrerit ornare urna. Fusce venenatis lorem vitae augue suscipit, </div>
      </div>
      </div>
    </div>
  );
}

export default App;
