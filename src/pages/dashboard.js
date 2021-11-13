import '../css_pages/loginCss.css'

function DashboardPage() {
    return (
      <body>
        <header>BANK NAMA</header>
        <div className='warper'>
          <section className='form signup'>
            <form action='#'>
              <div className='error-txt'>Agent found!</div>
              <div className='field input'>
                <label>Email</label>
                <input type='text'></input>
              </div>
              <div className='field input'>
                <label>Password</label>
                <input type='password'></input>
              </div>
              <div className='field tag'>
                <label>Role</label>
                <select className="Role" id="Role">
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div className='field button'>
                <input type='submit' value='Login'></input>
              </div>
            </form>
          </section>
        </div>
        <footer> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum orci a sapien imperdiet maximus.</footer>
      </body>
    );
  }
  
  export default DashboardPage;
