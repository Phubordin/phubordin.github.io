# -*- coding: utf-8 -*-
"""
สร้าง sitemap.xml ใหม่จากไฟล์ .html ที่มีอยู่จริงในโฟลเดอร์นี้

วิธีใช้ — เปิด Terminal ตรงโฟลเดอร์นี้แล้วพิมพ์:
    python generate-sitemap.py

เพิ่มหน้าใหม่ครั้งหน้าก็แค่รันซ้ำ ไม่ต้องมาแก้ sitemap.xml เอง
lastmod จะดึงจากวันที่แก้ไฟล์ล่าสุด (ไม่ใช่วันที่รัน) เพราะฉะนั้นหน้าที่ไม่ได้แก้ วันที่จะไม่ขยับ
"""

import os
import re
import io
import datetime

SITE = "https://phubordin.github.io"
HERE = os.path.dirname(os.path.abspath(__file__))

# ไฟล์ที่ไม่ต้องการให้ Google เก็บ (ไฟล์ทดสอบ / ชิ้นส่วนที่ไม่ใช่หน้าเว็บจริง)
EXCLUDE = {"_check.html", "_check2.html"}

# ความสำคัญของแต่ละหน้า (Google ใช้เป็นน้ำหนักเทียบกันภายในเว็บเดียวกัน)
PRIORITY = {
    "index.html": "1.0",   # หน้าแรก
    "home.html": "0.9",    # ศูนย์รวมทุกอย่าง
    "project.html": "0.9",
    "about.html": "0.8",
    "experience.html": "0.8",
    "certificate.html": "0.8",
    "contact.html": "0.7",
}
PRIORITY_DEFAULT = "0.6"   # หน้ารายละเอียดโปรเจกต์ / ประสบการณ์


def page_priority(name):
    return PRIORITY.get(name, PRIORITY_DEFAULT)


def lastmod(path):
    return datetime.date.fromtimestamp(os.path.getmtime(path)).isoformat()


def title_of(path):
    """ดึง <title> มาใส่เป็นคอมเมนต์ เพื่อให้อ่าน sitemap.xml ด้วยตาแล้วรู้ว่าหน้าไหนเป็นหน้าไหน"""
    try:
        # index.html มี <style> ก้อนใหญ่ก่อนถึง <title> เลยต้องอ่านเผื่อไว้เยอะหน่อย
        head = io.open(path, encoding="utf-8", errors="ignore").read(120000)
    except OSError:
        return ""
    m = re.search(r"<title>(.*?)</title>", head, re.S | re.I)
    if not m:
        return ""
    t = " ".join(m.group(1).split())
    return t.replace("--", "-")[:70]


def main():
    pages = sorted(
        f for f in os.listdir(HERE)
        if f.lower().endswith(".html") and f not in EXCLUDE
    )
    if not pages:
        raise SystemExit("ไม่พบไฟล์ .html ในโฟลเดอร์นี้")

    # เรียงหน้าสำคัญไว้บนสุด (index -> priority มากไปน้อย -> ชื่อไฟล์)
    pages.sort(key=lambda f: (f != "index.html", -float(page_priority(f)), f))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for f in pages:
        path = os.path.join(HERE, f)
        loc = SITE + "/" + ("" if f == "index.html" else f)
        title = title_of(path)
        if title:
            lines.append("  <!-- %s -->" % title)
        lines.append("  <url>")
        lines.append("    <loc>%s</loc>" % loc)
        lines.append("    <lastmod>%s</lastmod>" % lastmod(path))
        lines.append("    <priority>%s</priority>" % page_priority(f))
        lines.append("  </url>")
    lines.append("</urlset>")
    new = "\n".join(lines) + "\n"

    out = os.path.join(HERE, "sitemap.xml")
    old_urls = set()
    if os.path.exists(out):
        old_urls = set(re.findall(r"<loc>(.*?)</loc>",
                                  io.open(out, encoding="utf-8").read()))
    io.open(out, "w", encoding="utf-8", newline="\n").write(new)

    new_urls = set(re.findall(r"<loc>(.*?)</loc>", new))
    added, removed = sorted(new_urls - old_urls), sorted(old_urls - new_urls)

    print("เขียน sitemap.xml แล้ว : %d หน้า" % len(pages))
    for u in added:
        print("   + เพิ่ม  %s" % u)
    for u in removed:
        print("   - เอาออก %s  (ไม่มีไฟล์นี้แล้ว)" % u)
    if not added and not removed:
        print("   (รายชื่อหน้าเหมือนเดิม อัปเดตเฉพาะวันที่)")

    # robots.txt ต้องชี้มาที่ sitemap เสมอ ไม่งั้น Google หาไม่เจอ
    robots = os.path.join(HERE, "robots.txt")
    if not os.path.exists(robots) or "Sitemap:" not in io.open(robots, encoding="utf-8").read():
        io.open(robots, "w", encoding="utf-8", newline="\n").write(
            "User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % SITE)
        print("อัปเดต robots.txt ให้ชี้มาที่ sitemap แล้ว")


if __name__ == "__main__":
    main()
