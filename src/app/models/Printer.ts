export class Printer  {
  printer_type :PRINTER_TYPE;
  ip_address_of_printer: string;
  port:string;
  };

  export enum PRINTER_TYPE {
    WiFi = 'WiFi printer',
    Network = 'Network port printer'
}

  