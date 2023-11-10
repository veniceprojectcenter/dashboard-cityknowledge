var shipSchedule = [
  {"Date":"23/07/2014","Arrival":"0:00:00","Departure":"22:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"23/07/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"NOORDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"23/07/2014","Arrival":"7:30:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"23/07/2014","Arrival":"8:30:00","Departure":"18:00:00","Ship":"SEA CLOUD","Company":"SEA CLOUD CRUISES"},
  {"Date":"23/07/2014","Arrival":"14:00:00","Departure":"23:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"24/07/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"25/07/2014","Arrival":"0:00:00","Departure":"23:55:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"25/07/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"26/07/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"26/07/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"26/07/2014","Arrival":"8:00:00","Departure":"18:00:00","Ship":"TERE MOANA","Company":"PAUL GAUGUIN CRUISES"},
  {"Date":"26/07/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"26/07/2014","Arrival":"9:00:00","Departure":"23:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"26/07/2014","Arrival":"9:30:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"27/07/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"27/07/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"27/07/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"28/07/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"28/07/2014","Arrival":"7:30:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"28/07/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"28/07/2014","Arrival":"15:00:00","Departure":"23:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"29/07/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"29/07/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"30/07/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"30/07/2014","Arrival":"8:00:00","Departure":"18:00:00","Ship":"SEA CLOUD","Company":"SEA CLOUD CRUISES"},
  {"Date":"30/07/2014","Arrival":"14:30:00","Departure":"23:00:00","Ship":"SOVEREIGN","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"31/07/2014","Arrival":"0:00:00","Departure":"13:00:00","Ship":"SOVEREIGN","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"31/07/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"1/08/2014","Arrival":"0:00:00","Departure":"20:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"1/08/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"2/08/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"2/08/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"2/08/2014","Arrival":"8:00:00","Departure":"18:00:00","Ship":"TERE MOANA","Company":"PAUL GAUGUIN CRUISES"},
  {"Date":"2/08/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"3/08/2014","Arrival":"6:45:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"3/08/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"3/08/2014","Arrival":"8:30:00","Departure":"18:00:00","Ship":"AURORA","Company":"P & O CRUISES"},
  {"Date":"3/08/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"4/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"4/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"5/08/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"5/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"5/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"6/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"6/08/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"SEA CLOUD","Company":"SEA CLOUD CRUISES"},
  {"Date":"6/08/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"7/08/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"7/08/2014","Arrival":"0:00:00","Departure":"13:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"8/08/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"8/08/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"9/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"9/08/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"9/08/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"9/08/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"9/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"10/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"10/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"10/08/2014","Arrival":"6:45:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"10/08/2014","Arrival":"7:30:00","Departure":"23:00:00","Ship":"AEGEAN ODYSSEY","Company":"THE AEGEAN EXPERIENCE MARITIME CO LTD"},
  {"Date":"10/08/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"10/08/2014","Arrival":"9:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"10/08/2014","Arrival":"14:30:00","Departure":"23:00:00","Ship":"SOVEREIGN","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"11/08/2014","Arrival":"0:00:00","Departure":"13:00:00","Ship":"SOVEREIGN","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"11/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"11/08/2014","Arrival":"0:00:00","Departure":"1:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"11/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"AEGEAN ODYSSEY","Company":"THE AEGEAN EXPERIENCE MARITIME CO LTD"},
  {"Date":"11/08/2014","Arrival":"7:30:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"11/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"12/08/2014","Arrival":"0:00:00","Departure":"22:00:00","Ship":"AEGEAN ODYSSEY","Company":"THE AEGEAN EXPERIENCE MARITIME CO LTD"},
  {"Date":"12/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"13/08/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"13/08/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"14/08/2014","Arrival":"7:00:00","Departure":"19:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"14/08/2014","Arrival":"10:00:00","Departure":"23:00:00","Ship":"RIVIERA","Company":"OCEANIA CRUISES INC."},
  {"Date":"15/08/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"RIVIERA","Company":"OCEANIA CRUISES INC."},
  {"Date":"15/08/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"15/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"15/08/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"15/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"15/08/2014","Arrival":"22:00:00","Departure":"23:00:00","Ship":"SEA DREAM II","Company":"SEA DREAM YACHT CLUB"},
  {"Date":"16/08/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"SEA DREAM II","Company":"SEA DREAM YACHT CLUB"},
  {"Date":"16/08/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"16/08/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"16/08/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"16/08/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"17/08/2014","Arrival":"6:45:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"17/08/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"17/08/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"18/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"18/08/2014","Arrival":"7:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"18/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"19/08/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"19/08/2014","Arrival":"15:00:00","Departure":"23:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"20/08/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"20/08/2014","Arrival":"7:30:00","Departure":"23:00:00","Ship":"VARIETY VOYAGER","Company":"VARIETY CRUISES LTD"},
  {"Date":"20/08/2014","Arrival":"14:00:00","Departure":"23:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"21/08/2014","Arrival":"0:00:00","Departure":"14:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"21/08/2014","Arrival":"7:00:00","Departure":"23:00:00","Ship":"STAR PRIDE","Company":"WINDSTAR CRUISES"},
  {"Date":"21/08/2014","Arrival":"7:30:00","Departure":"19:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"22/08/2014","Arrival":"0:00:00","Departure":"15:00:00","Ship":"STAR PRIDE","Company":"WINDSTAR CRUISES"},
  {"Date":"22/08/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"EUROPA 2","Company":"HAPAG-LLOYD KREUZFAHRTEN"},
  {"Date":"22/08/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"23/08/2014","Arrival":"0:00:00","Departure":"22:00:00","Ship":"EUROPA 2","Company":"HAPAG-LLOYD KREUZFAHRTEN"},
  {"Date":"23/08/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"23/08/2014","Arrival":"7:15:00","Departure":"17:30:00","Ship":"SEABOURN ODYSSEY","Company":"SEABOURN CRUISE LINE"},
  {"Date":"23/08/2014","Arrival":"7:45:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"23/08/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"24/08/2014","Arrival":"6:45:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"24/08/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"25/08/2014","Arrival":"7:30:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"25/08/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"25/08/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"26/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"27/08/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"27/08/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"27/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"28/08/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"28/08/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"28/08/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"29/08/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"29/08/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"MSC ARMONIA","Company":"MSC CROCIERE SA."},
  {"Date":"29/08/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"30/08/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"30/08/2014","Arrival":"6:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"30/08/2014","Arrival":"7:00:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"30/08/2014","Arrival":"8:00:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"30/08/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"31/08/2014","Arrival":"6:45:00","Departure":"23:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"31/08/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"31/08/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"1/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"1/09/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"1/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"2/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"2/09/2014","Arrival":"8:30:00","Departure":"18:00:00","Ship":"ARCADIA","Company":"P & O CRUISES"},
  {"Date":"2/09/2014","Arrival":"13:30:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"3/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"3/09/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"4/09/2014","Arrival":"0:00:00","Departure":"1:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"4/09/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"4/09/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"4/09/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"NOORDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"4/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"5/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"NOORDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"5/09/2014","Arrival":"0:00:00","Departure":"20:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"6/09/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"6/09/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"6/09/2014","Arrival":"7:15:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"6/09/2014","Arrival":"7:45:00","Departure":"15:00:00","Ship":"FTI BERLIN","Company":"FTI CRUISES HELLAS LTD"},
  {"Date":"6/09/2014","Arrival":"8:15:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"6/09/2014","Arrival":"9:15:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"6/09/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"7/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"7/09/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"EMERALD PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"7/09/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"7/09/2014","Arrival":"9:00:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"8/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"8/09/2014","Arrival":"0:00:00","Departure":"12:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"8/09/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"8/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"8/09/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"9/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"9/09/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"10/09/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"10/09/2014","Arrival":"11:00:00","Departure":"23:00:00","Ship":"HORIZON","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"11/09/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"HORIZON","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"11/09/2014","Arrival":"7:00:00","Departure":"23:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"11/09/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"11/09/2014","Arrival":"9:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"12/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"12/09/2014","Arrival":"0:00:00","Departure":"14:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"13/09/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"13/09/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"13/09/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"13/09/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"13/09/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"14/09/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"14/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"14/09/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"15/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"15/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"16/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"17/09/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"18/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"18/09/2014","Arrival":"7:00:00","Departure":"19:00:00","Ship":"LE SOLEAL","Company":"COMPAGNIE DES ILES DU PONANT"},
  {"Date":"18/09/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"18/09/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"19/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"19/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER SPIRIT","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"19/09/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"VOYAGER","Company":"ALL LEISURE HOLIDAYS LTD"},
  {"Date":"19/09/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"20/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SILVER WIND","Company":"SILVERSEA CRUISES LTD"},
  {"Date":"20/09/2014","Arrival":"0:00:00","Departure":"23:30:00","Ship":"VOYAGER","Company":"ALL LEISURE HOLIDAYS LTD"},
  {"Date":"20/09/2014","Arrival":"4:00:00","Departure":"23:00:00","Ship":"OCEAN PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"20/09/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"20/09/2014","Arrival":"7:15:00","Departure":"16:00:00","Ship":"RYNDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"20/09/2014","Arrival":"7:45:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"20/09/2014","Arrival":"8:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"20/09/2014","Arrival":"8:45:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"20/09/2014","Arrival":"9:15:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"21/09/2014","Arrival":"0:00:00","Departure":"13:00:00","Ship":"OCEAN PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"21/09/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"21/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"21/09/2014","Arrival":"14:00:00","Departure":"23:00:00","Ship":"NOORDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"22/09/2014","Arrival":"0:00:00","Departure":"17:30:00","Ship":"NOORDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"22/09/2014","Arrival":"7:30:00","Departure":"23:00:00","Ship":"SEVEN SEAS MARINER","Company":"REGENT SEVEN SEAS CRUISES"},
  {"Date":"22/09/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"22/09/2014","Arrival":"9:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"22/09/2014","Arrival":"9:30:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"22/09/2014","Arrival":"11:30:00","Departure":"23:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"23/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"23/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"23/09/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"SEVEN SEAS MARINER","Company":"REGENT SEVEN SEAS CRUISES"},
  {"Date":"23/09/2014","Arrival":"8:30:00","Departure":"18:00:00","Ship":"AZURA","Company":"P & O CRUISES"},
  {"Date":"23/09/2014","Arrival":"10:00:00","Departure":"20:00:00","Ship":"OCEAN MAJESTY","Company":"MAJESTIC INTERNATIONAL CRUISES INC."},
  {"Date":"23/09/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"24/09/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"24/09/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"CELEBRITY SILHOUETTE","Company":"CELEBRITY CRUISES INC."},
  {"Date":"24/09/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"STAR CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"24/09/2014","Arrival":"8:30:00","Departure":"23:30:00","Ship":"BRAEMAR","Company":"FRED OLSEN CRUISE LINES LTD"},
  {"Date":"24/09/2014","Arrival":"10:30:00","Departure":"23:00:00","Ship":"AZAMARA QUEST","Company":"AZAMARA CLUB CRUISES"},
  {"Date":"24/09/2014","Arrival":"13:30:00","Departure":"23:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"24/09/2014","Arrival":"14:30:00","Departure":"23:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"25/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"25/09/2014","Arrival":"0:00:00","Departure":"14:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"25/09/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"AZAMARA QUEST","Company":"AZAMARA CLUB CRUISES"},
  {"Date":"26/09/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"26/09/2014","Arrival":"13:30:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"27/09/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"27/09/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"27/09/2014","Arrival":"7:15:00","Departure":"16:00:00","Ship":"SEABOURN ODYSSEY","Company":"SEABOURN CRUISE LINE"},
  {"Date":"27/09/2014","Arrival":"7:45:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"27/09/2014","Arrival":"8:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"27/09/2014","Arrival":"8:45:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"27/09/2014","Arrival":"9:15:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"28/09/2014","Arrival":"0:00:00","Departure":"1:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"28/09/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"28/09/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"28/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"28/09/2014","Arrival":"10:00:00","Departure":"17:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"28/09/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"ORIANA","Company":"P & O CRUISES"},
  {"Date":"29/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"ORIANA","Company":"P & O CRUISES"},
  {"Date":"29/09/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"29/09/2014","Arrival":"8:00:00","Departure":"18:00:00","Ship":"PRINSENDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"29/09/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"29/09/2014","Arrival":"10:00:00","Departure":"19:00:00","Ship":"OCEAN MAJESTY","Company":"MAJESTIC INTERNATIONAL CRUISES INC."},
  {"Date":"1/10/2014","Arrival":"8:00:00","Departure":"22:00:00","Ship":"MINERVA","Company":"ALL LEISURE HOLIDAYS LTD"},
  {"Date":"1/10/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"AZAMARA QUEST","Company":"AZAMARA CLUB CRUISES"},
  {"Date":"1/10/2014","Arrival":"17:00:00","Departure":"23:00:00","Ship":"LOUIS AURA","Company":"LOUIS CRUISE LINE"},
  {"Date":"2/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"LOUIS AURA","Company":"LOUIS CRUISE LINE"},
  {"Date":"2/10/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"AZAMARA QUEST","Company":"AZAMARA CLUB CRUISES"},
  {"Date":"2/10/2014","Arrival":"11:00:00","Departure":"23:00:00","Ship":"STAR PRIDE","Company":"WINDSTAR CRUISES"},
  {"Date":"2/10/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"3/10/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"3/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"STAR PRIDE","Company":"WINDSTAR CRUISES"},
  {"Date":"3/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"LOUIS AURA","Company":"LOUIS CRUISE LINE"},
  {"Date":"3/10/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"4/10/2014","Arrival":"0:00:00","Departure":"15:00:00","Ship":"STAR PRIDE","Company":"WINDSTAR CRUISES"},
  {"Date":"4/10/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"LOUIS AURA","Company":"LOUIS CRUISE LINE"},
  {"Date":"4/10/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"4/10/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"4/10/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"4/10/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"4/10/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"5/10/2014","Arrival":"7:00:00","Departure":"23:00:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"5/10/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"WIND SURF","Company":"WINDSTAR CRUISES"},
  {"Date":"5/10/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"5/10/2014","Arrival":"8:00:00","Departure":"16:00:00","Ship":"OCEAN MAJESTY","Company":"MAJESTIC INTERNATIONAL CRUISES INC."},
  {"Date":"5/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"5/10/2014","Arrival":"15:00:00","Departure":"23:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"6/10/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"SERENADE OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"6/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"6/10/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"6/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"7/10/2014","Arrival":"0:00:00","Departure":"23:59:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"7/10/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"8/10/2014","Arrival":"0:00:00","Departure":"20:30:00","Ship":"VENTURA","Company":"P & O CRUISES"},
  {"Date":"8/10/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"9/10/2014","Arrival":"0:00:00","Departure":"16:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"9/10/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"9/10/2014","Arrival":"9:00:00","Departure":"18:00:00","Ship":"SEA CLOUD","Company":"SEA CLOUD CRUISES"},
  {"Date":"10/10/2014","Arrival":"0:00:00","Departure":"20:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"10/10/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"11/10/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"11/10/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"11/10/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"11/10/2014","Arrival":"8:00:00","Departure":"19:30:00","Ship":"ROYAL CLIPPER","Company":"STAR CLIPPERS LTD"},
  {"Date":"11/10/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"12/10/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"12/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"13/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"14/10/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"14/10/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"15/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NIEUW AMSTERDAM","Company":"HOLLAND AMERICA LINES"},
  {"Date":"16/10/2014","Arrival":"13:00:00","Departure":"23:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"17/10/2014","Arrival":"0:00:00","Departure":"22:00:00","Ship":"REGAL PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"17/10/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"LA BELLE DE L'ADRIATIQUE","Company":"CROISE EUROPE ALSACE CROISIERES"},
  {"Date":"17/10/2014","Arrival":"11:00:00","Departure":"23:00:00","Ship":"ZENITH","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"18/10/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"ZENITH","Company":"PULLMANTUR CRUISES LTD"},
  {"Date":"18/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"LA BELLE DE L'ADRIATIQUE","Company":"CROISE EUROPE ALSACE CROISIERES"},
  {"Date":"18/10/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"18/10/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"18/10/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"18/10/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"18/10/2014","Arrival":"9:00:00","Departure":"19:00:00","Ship":"QUEEN VICTORIA","Company":"CUNARD LINE LTD"},
  {"Date":"19/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"LA BELLE DE L'ADRIATIQUE","Company":"CROISE EUROPE ALSACE CROISIERES"},
  {"Date":"19/10/2014","Arrival":"4:00:00","Departure":"23:00:00","Ship":"OCEAN PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"19/10/2014","Arrival":"7:00:00","Departure":"23:00:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"19/10/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"19/10/2014","Arrival":"8:30:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"19/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"20/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"20/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"LA BELLE DE L'ADRIATIQUE","Company":"CROISE EUROPE ALSACE CROISIERES"},
  {"Date":"20/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"SEABOURN SPIRIT","Company":"SEABOURN CRUISE LINE"},
  {"Date":"20/10/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"THOMSON MAJESTY","Company":"TUI TRAVEL PLC"},
  {"Date":"20/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"20/10/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"MARINA","Company":"OCEANIA CRUISES INC."},
  {"Date":"20/10/2014","Arrival":"13:30:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"21/10/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"21/10/2014","Arrival":"0:00:00","Departure":"18:00:00","Ship":"MARINA","Company":"OCEANIA CRUISES INC."},
  {"Date":"21/10/2014","Arrival":"0:00:00","Departure":"8:00:00","Ship":"LA BELLE DE L'ADRIATIQUE","Company":"CROISE EUROPE ALSACE CROISIERES"},
  {"Date":"21/10/2014","Arrival":"0:00:00","Departure":"23:59:00","Ship":"HARMONY G","Company":"VARIETY CRUISES LTD"},
  {"Date":"21/10/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"WIND SURF","Company":"WINDSTAR CRUISES"},
  {"Date":"22/10/2014","Arrival":"0:00:00","Departure":"1:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"22/10/2014","Arrival":"14:00:00","Departure":"23:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"23/10/2014","Arrival":"0:00:00","Departure":"14:00:00","Ship":"CELEBRITY EQUINOX","Company":"CELEBRITY CRUISES INC."},
  {"Date":"24/10/2014","Arrival":"7:00:00","Departure":"18:00:00","Ship":"CORINTHIAN","Company":"HELIOS SHIPPING LTD"},
  {"Date":"24/10/2014","Arrival":"8:00:00","Departure":"18:30:00","Ship":"GOLDEN IRIS","Company":"MANO MARITIME LTD"},
  {"Date":"25/10/2014","Arrival":"6:15:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"25/10/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"25/10/2014","Arrival":"7:30:00","Departure":"18:00:00","Ship":"NORWEGIAN JADE","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"25/10/2014","Arrival":"8:00:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"25/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"26/10/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"26/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"26/10/2014","Arrival":"9:30:00","Departure":"18:00:00","Ship":"ARCADIA","Company":"P & O CRUISES"},
  {"Date":"26/10/2014","Arrival":"10:00:00","Departure":"23:00:00","Ship":"ALBATROS","Company":"PHOENIX REISEN GMBH"},
  {"Date":"27/10/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"30/10/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"31/10/2014","Arrival":"0:00:00","Departure":"20:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"31/10/2014","Arrival":"10:00:00","Departure":"23:00:00","Ship":"AMADEA","Company":"PHOENIX REISEN GMBH"},
  {"Date":"1/11/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"1/11/2014","Arrival":"7:30:00","Departure":"23:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"1/11/2014","Arrival":"8:00:00","Departure":"22:00:00","Ship":"AIDA AURA","Company":"AIDA CRUISES"},
  {"Date":"1/11/2014","Arrival":"8:30:00","Departure":"16:30:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"2/11/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"GRAND CELEBRATION","Company":"IBEROCRUCEROS S.L."},
  {"Date":"2/11/2014","Arrival":"8:00:00","Departure":"17:00:00","Ship":"MSC FANTASIA","Company":"MSC CROCIERE SA."},
  {"Date":"2/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"3/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"5/11/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"8/11/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"8/11/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC PREZIOSA","Company":"MSC CROCIERE SA."},
  {"Date":"8/11/2014","Arrival":"12:00:00","Departure":"23:00:00","Ship":"OCEAN PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"9/11/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"OCEAN PRINCESS","Company":"PRINCESS CRUISES INC"},
  {"Date":"9/11/2014","Arrival":"10:00:00","Departure":"23:00:00","Ship":"ALBATROS","Company":"PHOENIX REISEN GMBH"},
  {"Date":"10/11/2014","Arrival":"0:00:00","Departure":"17:00:00","Ship":"ALBATROS","Company":"PHOENIX REISEN GMBH"},
  {"Date":"10/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"13/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"13/11/2014","Arrival":"13:30:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"14/11/2014","Arrival":"0:00:00","Departure":"23:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"15/11/2014","Arrival":"0:00:00","Departure":"1:00:00","Ship":"NORWEGIAN SPIRIT","Company":"NORWEGIAN CRUISE LINES"},
  {"Date":"15/11/2014","Arrival":"6:45:00","Departure":"16:50:00","Ship":"SPLENDOUR OF THE SEAS","Company":"ROYAL CARIBBEAN INTERNATIONAL"},
  {"Date":"17/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"23/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA MAGICA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"24/11/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"25/11/2014","Arrival":"8:30:00","Departure":"17:00:00","Ship":"MSC ORCHESTRA","Company":"MSC CROCIERE SA."},
  {"Date":"27/11/2014","Arrival":"8:00:00","Departure":"23:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"28/11/2014","Arrival":"0:00:00","Departure":"20:00:00","Ship":"QUEEN ELIZABETH","Company":"CUNARD LINE LTD"},
  {"Date":"1/12/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."},
  {"Date":"14/12/2014","Arrival":"9:00:00","Departure":"17:00:00","Ship":"COSTA FASCINOSA","Company":"COSTA CROCIERE S.P.A."}
];

var shipCapacities = [
  {
      "ShipName": "ADONIA",
      "Passengers": 826,
      "Crew": 0
  },
  {
      "ShipName": "AEGEAN ODYSSEY",
      "Passengers": 380,
      "Crew": 180
  },
  {
      "ShipName": "AIDA AURA",
      "Passengers": 1300,
      "Crew": 418
  },
  {
      "ShipName": "ARCADIA",
      "Passengers": 2388,
      "Crew": 976
  },
  {
      "ShipName": "ARTANIA",
      "Passengers": 1260,
      "Crew": 537
  },
  {
      "ShipName": "ASUKA II",
      "Passengers": 960,
      "Crew": 545
  },
  {
      "ShipName": "AURORA",
      "Passengers": 1950,
      "Crew": 850
  },
  {
      "ShipName": "AZAMARA JOURNEY",
      "Passengers": 694,
      "Crew": 407
  },
  {
      "ShipName": "AZAMARA QUEST",
      "Passengers": 702,
      "Crew": 408
  },
  {
      "ShipName": "AZURA",
      "Passengers": 3096,
      "Crew": 1226
  },
  {
      "ShipName": "BRAEMAR",
      "Passengers": 929,
      "Crew": 371
  },
  {
      "ShipName": "CARNIVAL DESTINY",
      "Passengers": 3006,
      "Crew": 1150
  },
  {
      "ShipName": "CARNIVAL LEGEND",
      "Passengers": 2124,
      "Crew": 930
  },
  {
      "ShipName": "CARNIVAL SUNSHINE",
      "Passengers": 3006,
      "Crew": 1150
  },
  {
      "ShipName": "CELEBRITY SILHOUETTE",
      "Passengers": 2886,
      "Crew": 1500
  },
  {
      "ShipName": "COLUMBUS 2",
      "Passengers": 824,
      "Crew": 400
  },
  {
      "ShipName": "COSTA FASCINOSA",
      "Passengers": 3780,
      "Crew": 0
  },
  {
      "ShipName": "COSTA MAGICA",
      "Passengers": 3470,
      "Crew": 1027
  },
  {
      "ShipName": "CROWN PRINCESS",
      "Passengers": 3080,
      "Crew": 1201
  },
  {
      "ShipName": "CRYSTAL SERENITY",
      "Passengers": 1070,
      "Crew": 655
  },
  {
      "ShipName": "DAWN PRINCESS",
      "Passengers": 1990,
      "Crew": 900
  },
  {
      "ShipName": "DELPHIN",
      "Passengers": 470,
      "Crew": 0
  },
  {
      "ShipName": "DEUTSCHLAND",
      "Passengers": 520,
      "Crew": 0
  },
  {
      "ShipName": "DISNEY MAGIC",
      "Passengers": 2400,
      "Crew": 945
  },
  {
      "ShipName": "EUROPA 2",
      "Passengers": 516,
      "Crew": 370
  },
  {
      "ShipName": "FTI BERLIN",
      "Passengers": 412,
      "Crew": 180
  },
  {
      "ShipName": "GOLDEN IRIS",
      "Passengers": 959,
      "Crew": 350
  },
  {
      "ShipName": "GRAND CELEBRATION",
      "Passengers": 1896,
      "Crew": 670
  },
  {
      "ShipName": "GRAND HOLIDAY",
      "Passengers": 1452,
      "Crew": 660
  },
  {
      "ShipName": "HARMONY G",
      "Passengers": 22,
      "Crew": 18
  },
  {
      "ShipName": "KRISTINA KATARINA",
      "Passengers": 450,
      "Crew": 100
  },
  {
      "ShipName": "LAUSTRAL",
      "Passengers": 264,
      "Crew": 136
  },
  {
      "ShipName": "LE SOLEAL",
      "Passengers": 264,
      "Crew": 139
  },
  {
      "ShipName": "LEGEND OF THE SEAS",
      "Passengers": 2076,
      "Crew": 720
  },
  {
      "ShipName": "MARINA",
      "Passengers": 1252,
      "Crew": 780
  },
  {
      "ShipName": "MINERVA",
      "Passengers": 350,
      "Crew": 160
  },
  {
      "ShipName": "MSC ARMONIA",
      "Passengers": 2087,
      "Crew": 700
  },
  {
      "ShipName": "MSC DIVINA",
      "Passengers": 3959,
      "Crew": 1325
  },
  {
      "ShipName": "MSC FANTASIA",
      "Passengers": 3900,
      "Crew": 1313
  },
  {
      "ShipName": "MSC MUSICA",
      "Passengers": 2550,
      "Crew": 987
  },
  {
      "ShipName": "MSC PREZIOSA",
      "Passengers": 3959,
      "Crew": 1370
  },
  {
      "ShipName": "NIEUW AMSTERDAM",
      "Passengers": 2106,
      "Crew": 929
  },
  {
      "ShipName": "NOORDAM",
      "Passengers": 1916,
      "Crew": 800
  },
  {
      "ShipName": "NORWEGIAN JADE",
      "Passengers": 2224,
      "Crew": 1100
  },
  {
      "ShipName": "NORWEGIAN SPIRIT",
      "Passengers": 1996,
      "Crew": 965
  },
  {
      "ShipName": "OCEAN MAJESTY",
      "Passengers": 621,
      "Crew": 257
  },
  {
      "ShipName": "OCEAN PRINCESS",
      "Passengers": 826,
      "Crew": 373
  },
  {
      "ShipName": "ORIANA",
      "Passengers": 1928,
      "Crew": 794
  },
  {
      "ShipName": "PACIFIC PRINCESS",
      "Passengers": 826,
      "Crew": 373
  },
  {
      "ShipName": "PRINSENDAM",
      "Passengers": 740,
      "Crew": 460
  },
  {
      "ShipName": "QUEEN ELIZABETH",
      "Passengers": 2547,
      "Crew": 0
  },
  {
      "ShipName": "QUEEN VICTORIA",
      "Passengers": 2014,
      "Crew": 900
  },
  {
      "ShipName": "QUEST FOR ADVENTURE",
      "Passengers": 602,
      "Crew": 220
  },
  {
      "ShipName": "REGAL PRINCESS",
      "Passengers": 3560,
      "Crew": 1346
  },
  {
      "ShipName": "RIVIERA",
      "Passengers": 1250,
      "Crew": 800
  },
  {
      "ShipName": "ROTTERDAM",
      "Passengers": 1404,
      "Crew": 600
  },
  {
      "ShipName": "ROYAL CLIPPER",
      "Passengers": 227,
      "Crew": 106
  },
  {
      "ShipName": "ROYAL PRINCESS",
      "Passengers": 3600,
      "Crew": 0
  },
  {
      "ShipName": "RUBY PRINCESS",
      "Passengers": 3080,
      "Crew": 1200
  },
  {
      "ShipName": "RYNDAM",
      "Passengers": 1258,
      "Crew": 602
  },
  {
      "ShipName": "SAGA SAPPHIRE",
      "Passengers": 1158,
      "Crew": 406
  },
  {
      "ShipName": "SEA CLOUD",
      "Passengers": 64,
      "Crew": 60
  },
  {
      "ShipName": "SEA CLOUD II",
      "Passengers": 96,
      "Crew": 63
  },
  {
      "ShipName": "SEA DREAM I",
      "Passengers": 108,
      "Crew": 0
  },
  {
      "ShipName": "SEABOURN LEGEND",
      "Passengers": 208,
      "Crew": 164
  },
  {
      "ShipName": "SEABOURN ODYSSEY",
      "Passengers": 450,
      "Crew": 335
  },
  {
      "ShipName": "SEABOURN QUEST",
      "Passengers": 450,
      "Crew": 335
  },
  {
      "ShipName": "SEABOURN SPIRIT",
      "Passengers": 208,
      "Crew": 164
  },
  {
      "ShipName": "SERENADE OF THE SEAS",
      "Passengers": 2490,
      "Crew": 891
  },
  {
      "ShipName": "SEVEN SEAS MARINER",
      "Passengers": 700,
      "Crew": 445
  },
  {
      "ShipName": "SEVEN SEAS VOYAGER",
      "Passengers": 700,
      "Crew": 447
  },
  {
      "ShipName": "SILVER SPIRIT",
      "Passengers": 540,
      "Crew": 376
  },
  {
      "ShipName": "SILVER WIND",
      "Passengers": 296,
      "Crew": 212
  },
  {
      "ShipName": "SPLENDOUR OF THE SEA",
      "Passengers": 2076,
      "Crew": 750
  },
  {
      "ShipName": "SPLENDOUR OF THE SEAS",
      "Passengers": 2076,
      "Crew": 750
  },
  {
      "ShipName": "STAR CLIPPER",
      "Passengers": 170,
      "Crew": 0
  },
  {
      "ShipName": "TERE MOANA",
      "Passengers": 90,
      "Crew": 60
  },
  {
      "ShipName": "THE WORLD",
      "Passengers": 200,
      "Crew": 250
  },
  {
      "ShipName": "THOMSON DREAM",
      "Passengers": 1506,
      "Crew": 600
  },
  {
      "ShipName": "THOMSON MAJESTY",
      "Passengers": 1970,
      "Crew": 620
  },
  {
      "ShipName": "VARIETY VOYAGER",
      "Passengers": 36,
      "Crew": 32
  },
  {
      "ShipName": "ZENITH",
      "Passengers": 1828,
      "Crew": 620
  },
  {
      "ShipName": "CELEBRITY EQUINOX",
      "Passengers": 2850,
      "Crew": 1250
  }
];

function shipsInPortToday() {
  var date = moment().tz("Europe/Rome").format('D/MM/YYYY');
  var time = moment().tz("Europe/Rome").format('HH:mm:00');
  var ships = shipsInPort(date, time);
  var passengers = 0;
  var crew = 0;
  ships.forEach(function(ship) {
    passengers += tourists(ship).passengers;
    crew += tourists(ship).crew;
  });
  return { ships: ships.length, passengers: passengers, crew: crew };
}

function thisWeek() {
  var today = moment().tz("Europe/Rome");
  var this_week = [today.format('D/MM/YYYY')];
  var day = today;
  while (day.add('1', 'day').format('dddd') != 'Sunday') {
    this_week.push(day.add('1', 'day').format('D/MM/YYYY'));
  }
  return this_week;
}

function shipsThisWeek() {
  var ships = [];
  var passengers = 0;
  var crew = 0;
  shipSchedule.forEach(function(entry) {
    if ($.inArray(entry.Date, thisWeek()) != -1) {
      ships.push(entry.Ship);
      passengers += tourists(entry.Ship).passengers
      crew += tourists(entry.Ship).crew;
    }
  });
  return { ships: ships.length, passengers: passengers, crew: crew };
}

function tourists(ship) {
  var passengers = 0;
  var crew = 0;
  shipCapacities.forEach(function(entry) {
    if (entry.ShipName.toLowerCase() == ship.toLowerCase()) {
      passengers += entry.Passengers;
      crew += entry.Crew;
    }
  });
  if (passengers == 0 && crew == 0) {
    passengers = 2000;
    crew = 500;
    // console.log('Ship "' + ship + '" needs capacity');
  }
  return { passengers: passengers, crew: crew };
}

function shipsInPort(date, time) {
  var ships = [];
  shipSchedule.forEach(function(entry) {
    if (entry.Date == date && dateCompare(time, entry.Arrival) == 1 && dateCompare(time, entry.Departure) == -1) {
      ships.push(entry.Ship);
    }
  });
  return ships;
}

$(function() {
  var shipsToday = shipsInPortToday();
  var shipsWeek = shipsThisWeek();
  $('#ships_in_port').text(shipsToday.ships);
  $('#ships_expected').text(shipsWeek.ships);
  $('#ships_passengers').text(replaceNumberWithCommas(shipsToday.passengers));
  $('#ships_crew').text(replaceNumberWithCommas(shipsToday.crew));
  $('#ships_tourists').text(replaceNumberWithCommas(shipsToday.passengers + shipsToday.crew));
  $('#tourists_expected').text(replaceNumberWithCommas(shipsWeek.passengers + shipsWeek.crew));

  // var cruiseRef = new Firebase('https://vpc.firebaseio.com/dashboard/ships/tourists');
  var cruiseRef = ckconfig.dat_fb.child('ships/tourists');
  cruiseRef.set(shipsToday.passengers + shipsToday.crew);
});


function replaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n= yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}

function dateCompare(time1,time2) {
  var t1 = new Date();
  var parts = time1.split(":");
  t1.setHours(parts[0],parts[1],parts[2],0);
  var t2 = new Date();
  parts = time2.split(":");
  t2.setHours(parts[0],parts[1],parts[2],0);

  // returns 1 if greater, -1 if less and 0 if the same
  if (t1.getTime()>t2.getTime()) return 1;
  if (t1.getTime()<t2.getTime()) return -1;
  return 0;
}
