const Footer = () => {
const year = new Date().getFullYear();
  return (
    <footer className='footer'>
        <p className='footer__copyright'>
            &copy;
            <span className='copyright__year'>{year}</span>
            &nbsp; by
            <a href='https://mohammadarmaan.netlify.app' className='website__link' target='_blank'> &nbsp; Mohammad Armaan</a>
        </p>
    </footer>
  )
}

export default Footer