var ckconfig = {
  dbs_url: 'https://cityknowledge.firebaseio.com/dashboards',
  wdg_url: 'https://cityknowledge.firebaseio.com/dashboards/widgets',
  dat_url: 'https://venicedata.firebaseio.com/dashboard',
  log_url: 'https://venicedata.firebaseio.com/dashboard/logs',
};
ckconfig.dbs_fb = new Firebase(ckconfig.dbs_url);
ckconfig.wdg_fb = new Firebase(ckconfig.wdg_url);
ckconfig.dat_fb = new Firebase(ckconfig.dat_url);
ckconfig.log_fb = new Firebase(ckconfig.log_url);
