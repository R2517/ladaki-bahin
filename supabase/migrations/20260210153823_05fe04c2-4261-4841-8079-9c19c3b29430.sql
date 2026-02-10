
-- Insert 120 test registrations for Amravati district with various types and statuses
DO $$
DECLARE
  reg_id uuid;
  i integer;
  talukas text[] := ARRAY['Amravati', 'Achalpur', 'Anjangaon Surji', 'Chandur Railway', 'Chandur Bazar', 'Daryapur', 'Morshi', 'Warud', 'Nandgaon Khandeshwar', 'Chikhaldara', 'Dharni', 'Bhatkuli', 'Tiosa', 'Dhamangaon Railway'];
  villages text[] := ARRAY['Badnera', 'Shegaon', 'Walgaon', 'Tapovan', 'Nimbhora', 'Dhamangaon', 'Paratwada', 'Gadge Nagar', 'Rajapeth', 'Wadali', 'Korala', 'Malthan', 'Yerla', 'Sirasgaon', 'Bhendi', 'Chincholi', 'Talegaon', 'Risod', 'Kathora', 'Amner'];
  reg_types text[] := ARRAY['new', 'renewal', 'activated'];
  statuses text[] := ARRAY['pending', 'activated', 'expired'];
  pay_statuses text[] := ARRAY['paid', 'partially_paid', 'unpaid'];
  pay_modes text[] := ARRAY['cash', 'online', 'upi', 'cheque'];
  scheme_types text[] := ARRAY['essential_kit', 'safety_kit', 'scholarship', 'pregnancy', 'marriage', 'death'];
  scheme_statuses text[] := ARRAY['pending', 'applied', 'approved', 'received', 'delivered', 'rejected'];
  first_names text[] := ARRAY['राम', 'श्याम', 'सुनील', 'अनिल', 'विजय', 'संजय', 'राजेश', 'महेश', 'दिनेश', 'सुरेश', 'गणेश', 'प्रकाश', 'अमोल', 'सचिन', 'नितीन', 'रवी', 'मोहन', 'किशोर', 'ज्ञानेश', 'योगेश', 'सागर', 'अक्षय', 'विकास', 'पंकज', 'धनंजय'];
  last_names text[] := ARRAY['पाटील', 'देशमुख', 'जाधव', 'गायकवाड', 'शिंदे', 'मोरे', 'कदम', 'वाघ', 'सोनवणे', 'चव्हाण', 'इंगळे', 'भोयर', 'राऊत', 'वानखडे', 'बोरकर', 'ठाकरे', 'खंडारे', 'नाईक', 'मेश्राम', 'गावंडे'];
  full_name text;
  r_type text;
  r_status text;
  p_status text;
  p_mode text;
  taluka text;
  village text;
  amt numeric;
  recv numeric;
  mob text;
  app_num text;
  reg_date date;
  scheme_count integer;
  s_type text;
  s_status text;
BEGIN
  FOR i IN 1..120 LOOP
    full_name := first_names[1 + (i % array_length(first_names, 1))] || ' ' || last_names[1 + (i % array_length(last_names, 1))];
    r_type := reg_types[1 + (i % 3)];
    taluka := talukas[1 + (i % array_length(talukas, 1))];
    village := villages[1 + (i % array_length(villages, 1))];
    p_mode := pay_modes[1 + (i % 4)];
    mob := '98' || lpad((70000000 + i * 731)::text, 8, '0');
    app_num := 'MH-AMR-' || lpad(i::text, 4, '0');
    reg_date := '2024-01-01'::date + (i * 3);

    -- Distribute statuses
    IF r_type = 'activated' THEN
      r_status := 'activated';
      p_status := 'paid';
      amt := CASE WHEN (i % 2 = 0) THEN 500 ELSE 700 END;
      recv := amt;
    ELSIF r_type = 'renewal' THEN
      r_status := CASE WHEN (i % 3 = 0) THEN 'expired' ELSE 'activated' END;
      p_status := CASE WHEN (i % 4 = 0) THEN 'partially_paid' ELSE 'paid' END;
      amt := 300;
      recv := CASE WHEN p_status = 'partially_paid' THEN 150 ELSE 300 END;
    ELSE -- new
      r_status := CASE WHEN (i % 5 = 0) THEN 'activated' WHEN (i % 5 = 1) THEN 'expired' ELSE 'pending' END;
      p_status := pay_statuses[1 + (i % 3)];
      amt := 500;
      recv := CASE WHEN p_status = 'paid' THEN 500 WHEN p_status = 'partially_paid' THEN 250 ELSE 0 END;
    END IF;

    INSERT INTO bandkam_registrations (
      applicant_name, registration_type, status, payment_status, payment_mode, amount, received_amount,
      district, taluka, village, mobile_number, application_number, form_date,
      aadhar_number, dob,
      activation_date, expiry_date
    ) VALUES (
      full_name, r_type, r_status, p_status, p_mode, amt, recv,
      'Amravati', taluka, village, mob, app_num, reg_date,
      lpad((100000000000 + i * 97)::text, 12, '0'),
      '1980-01-01'::date + (i * 100),
      CASE WHEN r_status = 'activated' THEN reg_date + 10 ELSE NULL END,
      CASE WHEN r_status = 'activated' THEN reg_date + 375 WHEN r_status = 'expired' THEN reg_date - 10 ELSE NULL END
    ) RETURNING id INTO reg_id;

    -- Add 1-3 schemes per registration
    scheme_count := 1 + (i % 3);
    FOR j IN 1..scheme_count LOOP
      s_type := scheme_types[1 + ((i + j) % array_length(scheme_types, 1))];
      s_status := scheme_statuses[1 + ((i + j) % array_length(scheme_statuses, 1))];
      INSERT INTO bandkam_schemes (
        registration_id, applicant_name, scheme_type, status,
        amount, commission_percent, commission_amount, received_amount,
        payment_status, payment_mode
      ) VALUES (
        reg_id, full_name, s_type, s_status,
        CASE WHEN s_type IN ('essential_kit','safety_kit') THEN 0 ELSE 500 END,
        CASE WHEN s_type IN ('essential_kit','safety_kit') THEN 0 ELSE 10 END,
        CASE WHEN s_type IN ('essential_kit','safety_kit') THEN 0 ELSE 50 END,
        CASE WHEN s_status IN ('delivered','received') THEN 500 ELSE 0 END,
        CASE WHEN s_status IN ('delivered','received') THEN 'paid' ELSE 'unpaid' END,
        pay_modes[1 + ((i + j) % 4)]
      );
    END LOOP;
  END LOOP;
END $$;
