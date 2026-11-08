from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_PATH = r"C:\Users\EMMY-TECH\Desktop\record-management-system\Record_Management_System_Presentation.pptx"


def hex_to_rgb(value):
    value = value.lstrip('#')
    return RGBColor(int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16))


NAVY = "0B3C5D"
BLUE = "1F5F8A"
TEAL = "59B4C3"
GOLD = "F5B700"
LIGHT = "F3F7FA"
TEXT = "1E1E1E"
WHITE = "FFFFFF"
GRAY = "D9E2EC"

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)


def add_title_slide(title, subtitle):
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = hex_to_rgb("F8FBFF")

    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.55))
    bar.fill.solid()
    bar.fill.fore_color.rgb = hex_to_rgb(NAVY)
    bar.line.fill.background()

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.6), Inches(1.0))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(28)
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = hex_to_rgb(NAVY)

    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(3.0), Inches(11.0), Inches(1.0))
    tf = sub_box.text_frame
    p = tf.paragraphs[0]
    p.text = subtitle
    p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(18)
    p.runs[0].font.color.rgb = hex_to_rgb(BLUE)

    accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(4.9), Inches(4.8), Inches(1.1))
    accent.fill.solid()
    accent.fill.fore_color.rgb = hex_to_rgb(TEAL)
    accent.line.fill.background()
    accent.text_frame.text = "Student Project\nSoftware Development"
    accent.text_frame.paragraphs[0].runs[0].font.size = Pt(18)
    accent.text_frame.paragraphs[0].runs[0].font.bold = True
    accent.text_frame.paragraphs[0].runs[0].font.color.rgb = hex_to_rgb(WHITE)
    accent.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    footer = slide.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.8), Inches(0.4))
    footer.text_frame.text = "Prepared for presentation and system demonstration"
    footer.text_frame.paragraphs[0].font.size = Pt(11)
    footer.text_frame.paragraphs[0].font.color.rgb = hex_to_rgb(GRAY)


def add_section_slide(title, bullets, subtitle=None):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = hex_to_rgb("FFFFFF")

    header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.7))
    header.fill.solid()
    header.fill.fore_color.rgb = hex_to_rgb(NAVY)
    header.line.fill.background()

    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.15), Inches(11.8), Inches(0.5))
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(24)
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = hex_to_rgb(WHITE)

    content = slide.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.5), Inches(5.2))
    tf = content.text_frame
    tf.word_wrap = True
    for i, bullet in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = bullet
        p.level = 0
        p.bullet = True
        p.space_after = Pt(12)
        p.runs[0].font.size = Pt(21)
        p.runs[0].font.color.rgb = hex_to_rgb(TEXT)

    if subtitle:
        foot = slide.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.8), Inches(0.3))
        foot.text_frame.text = subtitle
        foot.text_frame.paragraphs[0].font.size = Pt(10)
        foot.text_frame.paragraphs[0].font.color.rgb = hex_to_rgb(BLUE)


def add_two_column_slide(title, left_bullets, right_bullets, subtitle=None):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = hex_to_rgb("FFFFFF")

    header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.7))
    header.fill.solid()
    header.fill.fore_color.rgb = hex_to_rgb(BLUE)
    header.line.fill.background()

    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.15), Inches(11.8), Inches(0.5))
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(24)
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = hex_to_rgb(WHITE)

    left = slide.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(5.4), Inches(5.1))
    left_tf = left.text_frame
    for i, bullet in enumerate(left_bullets):
        p = left_tf.paragraphs[0] if i == 0 else left_tf.add_paragraph()
        p.text = bullet
        p.level = 0
        p.bullet = True
        p.space_after = Pt(12)
        p.runs[0].font.size = Pt(20)
        p.runs[0].font.color.rgb = hex_to_rgb(TEXT)

    right = slide.shapes.add_textbox(Inches(7.0), Inches(1.2), Inches(5.4), Inches(5.1))
    right_tf = right.text_frame
    for i, bullet in enumerate(right_bullets):
        p = right_tf.paragraphs[0] if i == 0 else right_tf.add_paragraph()
        p.text = bullet
        p.level = 0
        p.bullet = True
        p.space_after = Pt(12)
        p.runs[0].font.size = Pt(20)
        p.runs[0].font.color.rgb = hex_to_rgb(TEXT)

    if subtitle:
        foot = slide.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.8), Inches(0.3))
        foot.text_frame.text = subtitle
        foot.text_frame.paragraphs[0].font.size = Pt(10)
        foot.text_frame.paragraphs[0].font.color.rgb = hex_to_rgb(BLUE)


def add_architecture_slide():
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = hex_to_rgb("FFFFFF")

    header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.7))
    header.fill.solid()
    header.fill.fore_color.rgb = hex_to_rgb(NAVY)
    header.line.fill.background()

    title = slide.shapes.add_textbox(Inches(0.6), Inches(0.15), Inches(11.8), Inches(0.5))
    p = title.text_frame.paragraphs[0]
    p.text = "System Architecture"
    p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(24)
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = hex_to_rgb(WHITE)

    rect1 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.5), Inches(2.3), Inches(1.4))
    rect1.fill.solid(); rect1.fill.fore_color.rgb = hex_to_rgb(BLUE); rect1.line.fill.background()
    rect1.text_frame.text = "React Frontend\nBootstrap UI\nAxios requests"
    rect1.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    rect1.text_frame.paragraphs[0].runs[0].font.bold = True
    rect1.text_frame.paragraphs[0].runs[0].font.color.rgb = hex_to_rgb(WHITE)

    rect2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.2), Inches(1.5), Inches(2.9), Inches(1.4))
    rect2.fill.solid(); rect2.fill.fore_color.rgb = hex_to_rgb(TEAL); rect2.line.fill.background()
    rect2.text_frame.text = "Express API\nJWT auth\nProtected routes"
    rect2.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    rect2.text_frame.paragraphs[0].runs[0].font.bold = True
    rect2.text_frame.paragraphs[0].runs[0].font.color.rgb = hex_to_rgb(WHITE)

    rect3 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.1), Inches(1.5), Inches(3.3), Inches(1.4))
    rect3.fill.solid(); rect3.fill.fore_color.rgb = hex_to_rgb(GOLD); rect3.line.fill.background()
    rect3.text_frame.text = "PostgreSQL\nUsers, Employees,\nAttendance, Payroll"
    rect3.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    rect3.text_frame.paragraphs[0].runs[0].font.bold = True
    rect3.text_frame.paragraphs[0].runs[0].font.color.rgb = hex_to_rgb(TEXT)

    arrow1 = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(3.4), Inches(2.0), Inches(1.4), Inches(0.5))
    arrow1.fill.solid(); arrow1.fill.fore_color.rgb = hex_to_rgb(TEAL); arrow1.line.fill.background()
    arrow2 = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(8.3), Inches(2.0), Inches(0.7), Inches(0.5))
    arrow2.fill.solid(); arrow2.fill.fore_color.rgb = hex_to_rgb(TEAL); arrow2.line.fill.background()

    notes = slide.shapes.add_textbox(Inches(0.9), Inches(3.8), Inches(11.4), Inches(2.3))
    tf = notes.text_frame
    for i, text in enumerate([
        "1. User signs in and receives a JWT token.",
        "2. Frontend sends authenticated requests to the API.",
        "3. API queries PostgreSQL with parameterized SQL.",
        "4. The database returns records for display in the UI."
    ]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = text
        p.level = 0
        p.bullet = True
        p.space_after = Pt(10)
        p.runs[0].font.size = Pt(20)
        p.runs[0].font.color.rgb = hex_to_rgb(TEXT)


def add_database_slide():
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.background.fill
    bg.solid(); bg.fore_color.rgb = hex_to_rgb("FFFFFF")

    header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.7))
    header.fill.solid(); header.fill.fore_color.rgb = hex_to_rgb(TEAL); header.line.fill.background()
    title = slide.shapes.add_textbox(Inches(0.6), Inches(0.15), Inches(11.8), Inches(0.5))
    p = title.text_frame.paragraphs[0]; p.text = "Database Design"; p.alignment = PP_ALIGN.LEFT
    p.runs[0].font.size = Pt(24); p.runs[0].font.bold = True; p.runs[0].font.color.rgb = hex_to_rgb(WHITE)

    boxes = [
        ("users", "user_id\nusername\npassword hash"),
        ("employees", "employee_id\nfirst_name\nlast_name\ndepartment\nemail\nphone"),
        ("attendance", "attendance_id\nemployee_id\ndate\nstatus"),
        ("payroll", "payroll_id\nemployee_id\nbase_salary\nbonus\ndeductions\npay_date")
    ]
    x_positions = [0.8, 3.7, 6.6, 9.5]
    for idx, (name, content) in enumerate(boxes):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x_positions[idx]), Inches(1.3), Inches(2.4), Inches(2.8))
        box.fill.solid(); box.fill.fore_color.rgb = hex_to_rgb(LIGHT); box.line.color.rgb = hex_to_rgb(BLUE)
        tf = box.text_frame
        p = tf.paragraphs[0]
        p.text = name
        p.runs[0].font.size = Pt(16); p.runs[0].font.bold = True; p.runs[0].font.color.rgb = hex_to_rgb(BLUE)
        tf.word_wrap = True
        for line in content.split("\n"):
            if line == name: continue
            p = tf.add_paragraph(); p.text = line; p.runs[0].font.size = Pt(12); p.runs[0].font.color.rgb = hex_to_rgb(TEXT)

    notes = slide.shapes.add_textbox(Inches(0.9), Inches(5.0), Inches(11.6), Inches(1.4))
    tf = notes.text_frame
    for i, text in enumerate([
        "Unique constraints exist for username and employee email.",
        "Attendance and payroll rows link back to employees through foreign keys.",
        "Current improvements should include stronger validation, migration tracking, and better auditability."
    ]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph(); p.text = text; p.bullet = True; p.level = 0
        p.runs[0].font.size = Pt(18); p.runs[0].font.color.rgb = hex_to_rgb(TEXT)


def add_conclusion_slide():
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.background.fill; bg.solid(); bg.fore_color.rgb = hex_to_rgb("F7FAFC")
    banner = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.8))
    banner.fill.solid(); banner.fill.fore_color.rgb = hex_to_rgb(NAVY); banner.line.fill.background()
    title = slide.shapes.add_textbox(Inches(0.7), Inches(0.15), Inches(11.0), Inches(0.4))
    p = title.text_frame.paragraphs[0]; p.text = "Conclusion and Future Potential"; p.runs[0].font.size = Pt(24); p.runs[0].font.bold = True; p.runs[0].font.color.rgb = hex_to_rgb(WHITE)

    text = slide.shapes.add_textbox(Inches(0.9), Inches(1.4), Inches(11.3), Inches(4.5))
    tf = text.text_frame
    for i, entry in enumerate([
        "This project successfully demonstrates a complete record management workflow using a modern web stack.",
        "It covers authentication, CRUD operations, relational data storage, and UI-based management of employee records.",
        "The system is ready for academic demonstration and serves as a solid foundation for a larger HR platform.",
        "Future improvements may include reporting, role-based access, payroll calculations, stronger validation, and deployment hardening."
    ]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph(); p.text = entry; p.bullet = True; p.space_after = Pt(16)
        p.runs[0].font.size = Pt(21); p.runs[0].font.color.rgb = hex_to_rgb(TEXT)


add_title_slide("Record Management System", "Employee, Attendance, and Payroll Management Web Application")
add_section_slide("Project Overview", [
    "A full-stack web application designed to manage staff records and operational data.",
    "Includes authentication, employee records, attendance tracking, and payroll entry.",
    "Built using React for the frontend and Express with PostgreSQL for the backend.",
    "Suitable for small organizations, academic demonstrations, and system training."
], subtitle="CS / Software Development Project")
add_two_column_slide("Objectives", [
    "Simplify employee data management.",
    "Track attendance for each employee.",
    "Record payroll information in one system.",
    "Provide user authentication and protected access."
], [
    "Reduce manual spreadsheet management.",
    "Create a data-driven workflow for HR-style operations.",
    "Demonstrate integration between UI, API, and database layers.",
    "Build a practical system with room for future growth."
], subtitle="What the project aims to solve")
add_architecture_slide()
add_section_slide("Key Features", [
    "User registration and login with JWT-based authentication.",
    "Employee management: add, edit, delete, and list records.",
    "Attendance module with employee selection and status tracking.",
    "Payroll module for recording salary, bonus, deductions, and pay date.",
    "Responsive dashboard layout with Bootstrap styling and clear user feedback."
], subtitle="Functional highlights")
add_database_slide()
add_two_column_slide("Challenges and Solutions", [
    "The first issue was that employees were not displaying due to backend startup and request flow problems.",
    "Attendance inserts failed when an invalid employee reference was submitted.",
    "Missing/incorrect handling of auth and protected routes caused access issues.",
    "The UI needed clearer loading, empty, and error states."
], [
    "We fixed the server and confirmed API connectivity.",
    "We linked attendance and payroll forms to valid employee options.",
    "JWT protection was applied consistently across secure routes.",
    "We improved the user experience with better feedback and validation."
], subtitle="Problem-solving process")
add_section_slide("Implementation Result", [
    "The system is currently working locally with login/signup, dashboards, and secure record operations.",
    "The app successfully runs on localhost:3000 and the backend on localhost:5000.",
    "The project includes working CRUD flows for employees and supporting modules for attendance and payroll.",
    "It also includes documentation and a database report for technical review."
], subtitle="Current status")
add_section_slide("Demo Flow", [
    "1. Open the application and create an account or sign in.",
    "2. Navigate between Employees, Attendance, and Payroll tabs.",
    "3. Add records using the provided forms and validation rules.",
    "4. Observe table updates and confirm the API/database interaction.",
    "5. Explain how each component communicates in the full-stack architecture."
], subtitle="How to present the system during the viva or demo")
add_conclusion_slide()

prs.save(OUTPUT_PATH)
print(f"Presentation created: {OUTPUT_PATH}")
