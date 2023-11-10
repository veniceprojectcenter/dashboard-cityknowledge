require 'mechanize'
require 'active_support/all'
require 'yaml'

@mechanize = Mechanize.new { |agent|
  agent.user_agent_alias = 'Mac Safari'
  # if options[:proxy]
  #   unless options[:proxy_port]
  #     (options[:proxy], options[:proxy_port]) = options[:proxy].to_s.split(":")
  #   end
  #   agent.set_proxy options[:proxy], (options[:proxy_port] || 8080)
  # end
}

stazione = 2796 # VENEZIA
dati = []
5.upto(23) do |ora|
  dalle    = "0#{ora}.00"[-5..-1]
  alle     = "0#{ora}.59"[-5..-1]
  my_url = "https://prm.rfi.it/qo_prm/QO_Arrivi_SiPMR.aspx?Id=#{stazione}&"+
           "dalle=#{dalle}&alle=#{alle}"
  page = @mechanize.get(my_url)
  puts "Analizzo #{my_url}"
  contenuti = page.content.gsub("\n", ' ').gsub("\r", ' ').gsub("\t", ' ')
  righe_orario = contenuti.scan(/<tr[^>]*>(.*?)<\/tr>/).select{|r|
    r[0].scan(/<td[^>]*>(.*?)<\/td>/).size == 9
  }
  righe_orario = righe_orario.select{|r|
    r[0].scan(/<td[^>]*>(.*?)<\/td>/)[1][0] =~ /images\/trn_[^.]\.gif/
  }
  dati += righe_orario.map{|r|
    (
      orario, treno, partenza, binario, classe, imprese, fermate_prima, fermate_dopo, periodicita
    ) = r[0].scan(/<td[^>]*>(.*?)<\/td>/)
    treno_tipo = ''
    if treno[0] =~ /images\/trn_([^.])\.gif/
      treno_tipo = $1
    end
    treno_numero = ''
    if treno[0] =~ /<img[^>]+>(.*)$/
      treno_numero = $1.strip
    end
    origine_stazione = ''
    origine_ora      = ''
    if partenza[0] =~ /<a[^>]+>([^<]+)<\/a>.*\(([^\)]+)\)/
      origine_stazione = $1.strip
      origine_ora      = $2.strip
    end
    imprese = [''] unless imprese.is_a?(Array)
    {
      :arrivo           => orario[0].to_s.strip,
      :treno_tipo       => treno_tipo,
      :treno_numero     => treno_numero,
      :origine_stazione => origine_stazione,
      :origine_ora      => origine_ora     ,
      :impresa          => imprese[0].strip,
      :fermate          => fermate_prima[0].
                           scan(/<a[^>]+?>([^<]+?)<\/a>\(([^\)]+?)\)/).
                           map{|f| {
                             :stazione => f[0],
                             :orario   => f[1]
                           }}
    }
  }
  puts "  #{dati.size} treni"
end

File.open('orario_treni.yaml', 'w'){|f| f.puts dati.to_yaml}
File.open('treni.csv', 'w'){|f|
  f.puts dati.map{|d|
    "#{d[:treno_tipo]}|#{d[:treno_numero]}||"
  }.join("\n")
}

# INFROMAZIONI ULTERIORI SU VIAGGIATRENO
# S02593 = VENEZIA
# http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/tratteCanvas/S02593/20801
# http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/S02593/20801

