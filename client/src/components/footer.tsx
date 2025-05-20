import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-bold mb-4">CarRental</div>
            <p className="text-gray-400 text-sm">
              Premium car rental service offering a wide range of vehicles for all your needs. Drive in style and comfort.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars">
                  <a className="text-gray-400 hover:text-white">Browse Cars</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-gray-400 hover:text-white">My Account</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-gray-400 hover:text-white">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white">Terms & Conditions</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-gray-400 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-gray-400 hover:text-white">Cookie Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li className="text-gray-400">+1 (555) 123-4567</li>
              <li className="text-gray-400">info@carrentalservice.com</li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CarRental. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex space-x-2 mr-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Language:</span>
                <Select defaultValue="english">
                  <SelectTrigger className="bg-gray-700 text-white text-sm border-gray-600 focus:ring-primary focus:border-primary h-8 w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Currency:</span>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-gray-700 text-white text-sm border-gray-600 focus:ring-primary focus:border-primary h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="aed">AED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
