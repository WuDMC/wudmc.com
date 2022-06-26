<?php
class Template_main extends Template
{
	function __construct($page){
		parent::__construct($page);
		$this -> set_css('slider');
		$this -> set_css('popup');
		$this -> set_css('main');
		$this -> set_js_top('f');
		$this -> set_js_top('ajax');
		$this -> set_js_top('slider');
		$this -> set_js_top('popup');
		$this -> set_js_top('preloader');
		$this -> set_js_bottom('main');
	}
	public function get_top()
	{	
		$css_version = CSS_V;
		$js_version = JS_V;
		$title = SITENAME;
		echo "<!DOCTYPE html><html><head>
			<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
			<meta name=viewport content='width=device-width, initial-scale=1'>
			<script src='https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'></script>
            ";
		echo "<link rel='icon' type='image/png' sizes='32x32' href='/favicon32.png'><link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png'>";
		$this -> echo_css();
		$this -> echo_js_top();
		echo "<title>$title</title>

			<!-- Global site tag (gtag.js) - Google Analytics -->
			<script async src='https://www.googletagmanager.com/gtag/js?id=UA-184638376-1'></script>
			<script>
			  window.dataLayer = window.dataLayer || [];
			  function gtag(){dataLayer.push(arguments);}
			  gtag('js', new Date());

			  gtag('config', 'UA-184638376-1');
			</script>
			<!-- Yandex.Metrika counter -->
			<script type='text/javascript' >
			   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
			   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
			   (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

			   ym(70033861, 'init', {
					clickmap:true,
					trackLinks:true,
					accurateTrackBounce:true,
					webvisor:true
			   });
			</script>
			<noscript><div><img src='https://mc.yandex.ru/watch/70033861' style='position:absolute; left:-9999px;' alt='' /></div></noscript>
			<!-- /Yandex.Metrika counter -->
						</head><body>";
		$this -> include_chank('preloader') -> get();
		$this -> include_chank('header') -> get();
	}
	public function get_bottom()
	{	
		$this -> include_chank('footer') -> get();
		$this -> echo_js_bottom();
		echo '
		<!-- calltouch -->

		<script type="text/javascript">

		(function(w,d,n,c){w.CalltouchDataObject=n;w[n]=function(){w[n]["callbacks"].push(arguments)};if(!w[n]["callbacks"]){w[n]["callbacks"]=[]}w[n]["loaded"]=false;if(typeof c!=="object"){c=[c]}w[n]["counters"]=c;for(var i=0;i<c.length;i+=1){p(c[i])}function p(cId){var a=d.getElementsByTagName("script")[0],s=d.createElement("script"),i=function(){a.parentNode.insertBefore(s,a)};s.type="text/javascript";s.async=true;s.src="https://mod.calltouch.ru/init.js?id="+cId;if(w.opera=="[object Opera]"){d.addEventListener("DOMContentLoaded",i,false)}else{i()}}})(window,document,"ct","ikftpr5h");

		</script>
		<script type="text/javascript">
		jQuery(document).on(\'click\', \'div.popupcontent div.btn.next.as5_btn_2\', function() {
			var m = jQuery(this).closest(\'div.popupcontent\');
			var ct_fio = m.find(\'input[placeholder="имя"]\').val();
			var ct_mail = m.find(\'input[placeholder="e-mail"]\').val();
			var ct_phone = m.find(\'input[placeholder="телефон"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Узнать стоимость строительства\';
			var ct_data = {
				fio: ct_fio,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
			if (!!ct_fio && !!ct_phone && !!ct_mail){
				console.log(ct_data);
				jQuery.ajax({
					url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\',  
					dataType: \'json\', type: \'POST\', data: ct_data, async: false
				});
			}
		});
		</script>
		<script type="text/javascript">
		jQuery(document).on(\'click\', \'div.new_btn.cb\', function() {
		jQuery(document).on(\'mousedown\', \'form div.as5_btn_3.btn\', function() {
			var m = jQuery(this).closest(\'div.popupcontent\');
			var ct_fio = m.find(\'input[name="name"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Узнать как\';
			var ct_data = {
				fio: ct_fio,
				phoneNumber: ct_phone,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
			if (!!ct_fio && !!ct_phone){
				console.log(ct_data);
				jQuery.ajax({
					url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\',  
					dataType: \'json\', type: \'POST\', data: ct_data, async: false
				});
			}
		});
		});
		</script>
		<script type="text/javascript">
		jQuery(document).on(\'click\', \'form div.as5_btn_1.btn\', function() {
			var m = jQuery(this).closest(\'form\');
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Каталог\';
			var ct_data = {
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
			if (!!ct_phone && !!ct_mail){
				console.log(ct_data);
				jQuery.ajax({
					url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\',  
					dataType: \'json\', type: \'POST\', data: ct_data, async: false
				});
			}
		});
		</script>

		<script type="text/javascript">
		jQuery(document).on(\'click\', \'form.callback div.as5_btn_3.btn\', function() {
			var m = jQuery(this).closest(\'form.callback\');
			var ct_phone = m.find(\'input[name="name"]\').val();
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_comment = m.find(\'textarea[name="message"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Задать вопрос\';
			var ct_data = {
				comment: ct_comment,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
			if (!!ct_phone && !!ct_mail){
				console.log(ct_data);
				jQuery.ajax({
					url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\',  
					dataType: \'json\', type: \'POST\', data: ct_data, async: false
				});
			}
		});
		</script>

		<script type="text/javascript">
		jQuery(document).on(\'mousedown touchstart click\', \'div.as5_btn_2.btn\', function() {
		jQuery(document).on(\'mousedown touchstart click\', \'form.change.noimage div.as5_btn_1.btn\', function() {
			var m = jQuery(this).closest(\'form.change.noimage\');
			var ct_fio = m.find(\'input[name="name"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Консультация\';
			var ct_data = {
				fio: ct_fio,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
					var ct_valid = !!ct_phone && !!ct_mail;
		if (ct_valid && window.ct_snd_flag != 1){
			window.ct_snd_flag = 1; setTimeout(function(){ window.ct_snd_flag = 0; }, 20000);
			jQuery.ajax({  
				url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\', 
				dataType: \'json\', type: \'POST\', data: ct_data, async: false, error: function(){
					window.ct_snd_flag = 0;
					console.log(\'request error!\')
				}
			}); 
		} else { console.log(\'spam\')}
		});
			});
		</script>

		

				<script type="text/javascript">
		jQuery(document).on(\'mousedown touchstart click\', \'div.new_btn.cb\', function() {
						console.log(\'Узнать как\');
		jQuery(document).on(\'mousedown touchstart click\', \'div.as5_btn_3.btn\', function() {
			var m = jQuery(this).closest(\'form\');
			var ct_fio = m.find(\'input[name="name"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Узнать как\';
			var ct_data = {
				fio: ct_fio,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
					var ct_valid = !!ct_phone && !!ct_mail;
		if (ct_valid && window.ct_snd_flag != 1){
			window.ct_snd_flag = 1; setTimeout(function(){ window.ct_snd_flag = 0; }, 20000);
			jQuery.ajax({  
				url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\', 
				dataType: \'json\', type: \'POST\', data: ct_data, async: false, error: function(){
					window.ct_snd_flag = 0;
					console.log(\'request error!\')
				}
			}); 
		} else { console.log(\'spam\')}
		});
			});
		</script>


						<script type="text/javascript">
		jQuery(document).on(\'mousedown touchstart click\', \'div.new_btn.tt\', function() {
			console.log(\'Теплотехнический\');
		jQuery(document).on(\'mousedown touchstart click\', \'div.as5_btn_1.btn\', function() {
			var m = jQuery(this).closest(\'form\');
			var ct_fio = m.find(\'input[name="name"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Теплотехнический расчет\';
			var ct_data = {
				fio: ct_fio,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
					var ct_valid = !!ct_phone && !!ct_mail;
		if (ct_valid && window.ct_snd_flag != 1){
			window.ct_snd_flag = 1; setTimeout(function(){ window.ct_snd_flag = 0; }, 20000);
			jQuery.ajax({  
				url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\', 
				dataType: \'json\', type: \'POST\', data: ct_data, async: false, error: function(){
					window.ct_snd_flag = 0;
					console.log(\'request error!\')
				}
			}); 
		} else { console.log(\'spam\')}
		});
			});
		</script>


		<script type="text/javascript">
		jQuery(document).on(\'click\', \'form div.as5_btn_2.btn\', function() {
			var m = jQuery(this).closest(\'form\');
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_mail = m.find(\'input[name="email"]\').val();
			var ct_comment = m.find(\'textarea[name="message"]\').val();
			var ct_check = m.find(\'div.file.important span\').html();
			var ct_site_id = \'41537\';
			var ct_sub = \'Индивидуальный проект\';
			var ct_data = {
				comment: ct_comment,
				phoneNumber: ct_phone,
				email: ct_mail,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
			if (!!ct_phone && !!ct_mail && ct_check!= "Прикрепить файлы до 100 мб"){
				console.log(ct_data);
				jQuery.ajax({
					url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\',  
					dataType: \'json\', type: \'POST\', data: ct_data, async: false
				});
			}
		});
		</script>

				<script type="text/javascript">
		jQuery(document).on(\'mousedown touchstart click\', \'form div.as5_btn_3.btn\', function() {
			var m = jQuery(this).closest(\'form\');
			var ct_fio = m.find(\'input[name="name"]\').val();
			var ct_phone = m.find(\'input[name="phone"]\').val();
			var ct_comment = m.find(\'textarea[name="message"]\').val();
			var ct_site_id = \'41537\';
			var ct_sub = \'Вопросы?\';
			var ct_data = {
				comment: ct_comment,
				phoneNumber: ct_phone,
				subject: ct_sub,
				requestUrl: location.href,
				sessionId: window.call_value
			};
		var ct_valid = !!ct_phone && !!ct_fio;
		if (ct_valid && window.ct_snd_flag != 1){
			window.ct_snd_flag = 1; setTimeout(function(){ window.ct_snd_flag = 0; }, 20000);
			jQuery.ajax({  
				url: \'https://api.calltouch.ru/calls-service/RestAPI/requests/\'+ct_site_id+\'/register/\', 
				dataType: \'json\', type: \'POST\', data: ct_data, async: false, error: function(){
					window.ct_snd_flag = 0;
					console.log(\'request error!\')
				}
			}); 
		} else { console.log(\'spam\')}
		});
		</script>
		<!-- calltouch -->

		</body></html>';
	}
}
?>