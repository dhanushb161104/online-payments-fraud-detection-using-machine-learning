from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        # Logo placeholder (if any)
        
        # Arial bold 15
        self.set_font('Helvetica', 'B', 20)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(30, 10, 'Online Payments Fraud Detection System', 0, 0, 'C')
        # Line break
        self.ln(20)

    # Page footer
    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Helvetica', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

def create_pdf(filename):
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Helvetica', '', 12)
    
    # Overview
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(0, 10, 'Project Overview', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    overview_text = (
        "The Online Payments Fraud Detection system is a proactive approach to identify and prevent "
        "fraudulent activities during online transactions. By leveraging historical transaction data, "
        "customer behavior patterns, and machine learning algorithms, this project aims to detect "
        "potential fraud in real time, ensuring secure and trustworthy online payment experiences "
        "for users and businesses alike."
    )
    pdf.multi_cell(0, 10, overview_text)
    pdf.ln(5)

    # Scenarios
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 10, 'Scenarios Addressed:', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '1. Real-time Fraud Monitoring', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "The system continuously monitors transactions in real time, analyzing features like amount, location, device, and behavior to flag suspicious activities.")
    pdf.ln(2)

    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '2. Fraudulent Account Detection', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "Machine learning models detect patterns indicative of fraudulent accounts or activities based on user behavior over time.")
    pdf.ln(2)

    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, '3. Adaptive Fraud Prevention', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "The system adapts and improves its fraud detection capabilities by learning from new data and adjusting algorithms against evolving fraud trends.")
    pdf.ln(5)

    # Technical Architecture
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(0, 10, 'Technical Architecture', 0, 1)
    
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 10, '- Machine Learning Model', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "A RandomForestClassifier is trained on payment datasets to classify transactions as legitimate or fraudulent based on numerical and categorical features.")
    
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 10, '- Backend API (Flask)', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "A RESTful API built with Flask (Python) that serves the trained machine learning model. It receives transaction details via POST requests and returns a risk score and classification in milliseconds.")
    
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 10, '- Frontend Dashboard (HTML/CSS/JS)', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 8, "A modern, responsive, and visually appealing web dashboard. It allows users to simulate transactions and instantly visualizes the transaction risk assessment, mimicking a real-time monitoring interface.")
    pdf.ln(5)
    
    # Conclusion
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(0, 10, 'Project Value', 0, 1)
    pdf.set_font('Helvetica', '', 12)
    pdf.multi_cell(0, 10, "Provides automated, low-latency transaction vetting to significantly reduce chargebacks and protect both merchants and customers from financial loss.")

    pdf.output(filename)

if __name__ == '__main__':
    doc_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Fraud_Detection_Project_Documentation.pdf')
    create_pdf(doc_path)
    print(f"PDF generated successfully at: {doc_path}")
