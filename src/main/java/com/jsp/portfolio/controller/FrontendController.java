package com.jsp.portfolio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Only the React route is forwarded; API, admin, resume and detail routes keep
 * their existing handlers and security rules. */
@Controller
public class FrontendController {
    @GetMapping("/myworks")
    public String works() {
        return "forward:/index.html";
    }
}
