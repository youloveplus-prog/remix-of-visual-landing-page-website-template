
DO $$
DECLARE fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.protect_post_pin_field()',
    'public.protect_message_columns_on_recipient_update()',
    'public.protect_profile_privileged_fields()',
    'public.recalculate_order_total()',
    'public.handle_new_user()',
    'public.update_updated_at_column()',
    'public.handle_lesson_completion()',
    'public.enforce_lesson_xp()',
    'public.auto_enroll_revision()',
    'public.award_lesson_completion()',
    'public.touch_last_seen()',
    'public.log_lesson_completion()',
    'public.log_order_placed()',
    'public.protect_pod_design_fields()',
    'public.protect_post_immutable_fields()',
    'public.enforce_order_item_price()',
    'public.protect_learner_profile_fields()',
    'public.products_search_vec_update()',
    'public.content_items_search_vec_update()',
    'public.mentors_search_vec_update()',
    'public.posts_search_vec_update()'
  ]
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
  END LOOP;
END $$;
