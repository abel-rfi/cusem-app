import '../css_pages/dashboardCss.css'



function DashboardPage() {
  return (
    <ul>
      <li>
        <a href="#livechat">Live Chat</a>
      </li>
      <li>
        <a href="#email">Email</a>
      </li>
      <li>
        <a class="active" href="#dashboard_menu">Dashboard</a>
      </li>
      <li>
        <a href="#FAQ">FAQ</a>
      </li>
      <li>
        <a href="#ticketarch">TicketArch</a>
      </li>
    </ul>
  );
}

export default DashboardPage;
