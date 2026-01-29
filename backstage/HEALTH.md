# [Project Name] - Health Metrics

> 🤖
>
> - [README](../README.md) - Our project
> - [CHANGELOG](CHANGELOG.md) — What we did
> - [ROADMAP](ROADMAP.md) — What we wanna do
> - [POLICY](POLICY.md) — How we do it
> - [HEALTH](HEALTH.md) — What we accept
>
> 🤖

---

> 🌟
>
> This project follows the [global backstage HEALTH](global/HEALTH.md)
> Do write all tests here as explained below
> [/backstage-start](.github/prompts/backstage-start.prompt.md) trigger tests
> For more policies, see [POLICY.md](POLICY.md)
>
> 🌟

### Test: Storybook Build Validation

```bash
npm run build-storybook > /dev/null 2>&1 && echo "✅ All stories build successfully" || echo "❌ Storybook build failed"
```

Expected: All stories compile without errors
Pass: ✅ All stories build successfully

---

### Test: All Story Files Have Valid Exports

```bash
# Quick validation: all .stories.tsx files export a default meta object
find src/ -name "*.stories.tsx" -exec grep -L "export default" {} \; | wc -l | xargs -I {} test {} -eq 0 && echo "✅ All story files have exports" || echo "❌ Some story files missing default export"
```

Expected: All .stories.tsx files have `export default`
Pass: ✅ All story files have exports

---

### Test: No Broken Story References

```bash
# Check if any .tsx files reference non-existent story IDs
grep -r "story.*id.*['\"]" src/ --include="*.tsx" --include="*.ts" && echo "⚠️ Manual review needed" || echo "✅ No hardcoded story IDs found"
```

Expected: No hardcoded story ID references that could break
Pass: ✅ No hardcoded story IDs OR manual review confirms all are valid

---

## Summary

**Project-specific checks ensure:**

- ✅ [Your requirement 1]
- ✅ [Your requirement 2]
- ✅ [Your requirement 3]

---

**Run all checks:**

````bash
# Universal checks (apply to all backstage projects)
bash -c "$(grep -A 1 '^```bash' global/HEALTH.md | grep -v '^```' | grep -v '^--$')"

# Project-specific checks (this project only)
bash -c "$(grep -A 1 '^```bash' HEALTH.md | grep -v '^```' | grep -v '^--$')"
````
