function print_email_ns(auth,em)
{
  em = em.substring(3,em.length-3);
  auth = auth.substring(4,auth.length-4);
  document.write('<a href="mailto:',em,'" title="Защищён от спам-роботов">',auth,'</a>');
}


function check_submit(form)
{
  if(document.all||document.getElementById)
  {
    for (i=0;i<form.length;i++)
    {
      var tempobj=form.elements[i]
      if(tempobj.type.toLowerCase()=="submit")
      {
       tempobj.disabled=true
      }
    }
  }
}
