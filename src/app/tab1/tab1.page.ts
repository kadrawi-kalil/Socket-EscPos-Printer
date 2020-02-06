import { Component } from '@angular/core';
import { PrinterService } from '../services/printer.service';
import {Printer} from '../models/Printer';
import {ReceiptDetail} from '../models/ReceiptDetail';
declare var Socket: any;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  ip_address_printer:string='';
  port_printer:string='9100';
  title_to_print:string='Test Resto';
  constructor(private printerService: PrinterService  ) { 
  }

  test(){
    const receipt  = new ReceiptDetail();
    console.log('printerService.generateQrReceipt')
    receipt.order_id= '5gt4583';
    receipt.restaurant_name= this.title_to_print;
    receipt.table_number= '32';
    receipt.pax= '58';
    receipt.qr_url= 'http://www.example.org';

    enum PRINTER_TYPE {
      WiFi = 'WiFi printer',
      Network = 'Network port printer'
    }
    const printer =new Printer();
    printer.port=this.port_printer;
    printer.ip_address_of_printer=this.ip_address_printer;
    printer.printer_type='ok';
    console.log(printer)
    this.printerService.printQrReceipt(printer,receipt);
  }
  


}
